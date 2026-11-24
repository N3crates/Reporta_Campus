import {
    doc,
    runTransaction,
    collection,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
import { db } from './firebase.js'

// Flujo estricto de transiciones
const FLUJO_ESTADOS = {
    'reportado': 'en_proceso',
    'en_proceso': 'resuelto'
}

const esTransicionValida = (estadoActual, estadoNuevo) => {
    return FLUJO_ESTADOS[estadoActual] === estadoNuevo
}

/**
 * Cambia el estado de una incidencia y guarda el movimiento en el historial
 * dentro de una sola transaccion
 */
export const cambiarEstado = async (incidenciaId, nuevoEstado, comentario = '', responsableId = 'demo-responsable') => {
    if (!incidenciaId) {
        throw new Error('El ID de la incidencia es obligatorio')
    }

    const comentarioLimpio = String(comentario || '').trim()

    // No se puede resolver sin dejar explicacion del trabajo realizado
    if (nuevoEstado === 'resuelto' && !comentarioLimpio) {
        throw new Error('Es obligatorio ingresar un comentario de resolución para cerrar la incidencia')
    }

    const incidenciaRef = doc(db, 'incidencias', incidenciaId)
    const historialColRef = collection(db, 'incidencias', incidenciaId, 'historial_estados')
    const nuevoHistorialRef = doc(historialColRef)

    const resultado = await runTransaction(db, async (transaction) => {
        // Leemos el estado real en vivo de Firestore para evitar cambios dobles
        const docSnap = await transaction.get(incidenciaRef)

        if (!docSnap.exists()) {
            throw new Error('La incidencia no existe en la base de datos')
        }

        const incidenciaActual = docSnap.data()
        const estadoActual = incidenciaActual.estado

        // Validamos que no se brinquen pasos ni se regrese
        if (!esTransicionValida(estadoActual, nuevoEstado)) {
            throw new Error(`Transición no válida: no se puede pasar de "${estadoActual}" a "${nuevoEstado}"`)
        }

        const fechaServidor = serverTimestamp()

        // Campos a actualizar en la incidencia principal
        const datosActualizados = {
            estado: nuevoEstado,
            responsableId: responsableId,
            fechaActualizacion: fechaServidor
        }

        // Si se marca como resuelta, registramos su fecha oficial de cierre
        if (nuevoEstado === 'resuelto') {
            datosActualizados.fechaResolucion = fechaServidor
        }

        // 1. Actualizar la incidencia
        transaction.update(incidenciaRef, datosActualizados)

        // 2. Registrar el movimiento en la subcoleccion historial_estados
        transaction.set(nuevoHistorialRef, {
            estadoAnterior: estadoActual,
            estadoNuevo: nuevoEstado,
            responsableId: responsableId,
            comentario: comentarioLimpio,
            fecha: fechaServidor
        })

        return {
            id: incidenciaId,
            estadoAnterior: estadoActual,
            estadoNuevo: nuevoEstado
        }
    })

    return resultado
}
