import {
    doc,
    runTransaction,
    collection,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from './firebase.js';
import { protegerPagina } from './auth.js';
import { crearError } from './mensajes.js';

// Flujo estricto de transiciones
const FLUJO_ESTADOS = {
    reportado: 'en_proceso',
    en_proceso: 'resuelto'
};

const esTransicionValida = (estadoActual, estadoNuevo) => {
    return FLUJO_ESTADOS[estadoActual] === estadoNuevo;
};

/**
 * Cambia el estado de una incidencia y guarda el movimiento en el historial
 * dentro de una sola transaccion
 */
export const cambiarEstado = async (
    incidenciaId,
    nuevoEstado,
    comentario = '',
    responsableId = null
) => {
    const usuario = await protegerPagina(['responsable', 'admin']);
    if (!usuario) {
        throw crearError('unauthenticated');
    }
    if (responsableId && responsableId !== usuario.uid) {
        throw crearError('permission-denied');
    }
    responsableId = usuario.uid;
    if (!incidenciaId) {
        throw crearError('validacion', 'El ID de la incidencia es obligatorio');
    }

    const comentarioLimpio = String(comentario || '').trim();

    // No se puede resolver sin dejar explicacion del trabajo realizado
    if (!comentarioLimpio || comentarioLimpio.length > 500) {
        throw crearError(
            'validacion',
            'Agrega un comentario de seguimiento de hasta 500 caracteres.'
        );
    }

    const incidenciaRef = doc(db, 'incidencias', incidenciaId);
    const historialColRef = collection(db, 'incidencias', incidenciaId, 'historial_estados');
    const nuevoHistorialRef = doc(historialColRef);

    const resultado = await runTransaction(db, async (transaction) => {
        // Leemos el estado real en vivo de Firestore para evitar cambios dobles
        const docSnap = await transaction.get(incidenciaRef);

        if (!docSnap.exists()) {
            throw crearError('not-found');
        }

        const incidenciaActual = docSnap.data();
        const estadoActual = incidenciaActual.estado;

        // Validamos que no se brinquen pasos ni se regrese
        if (incidenciaActual.eliminado || !esTransicionValida(estadoActual, nuevoEstado)) {
            throw crearError('conflict');
        }

        const fechaServidor = serverTimestamp();

        // Campos a actualizar en la incidencia principal
        const datosActualizados = {
            estado: nuevoEstado,
            responsableId: responsableId,
            ultimoMovimientoId: nuevoHistorialRef.id,
            fechaActualizacion: fechaServidor
        };

        // Si se marca como resuelta, registramos su fecha oficial de cierre
        if (nuevoEstado === 'resuelto') {
            datosActualizados.fechaResolucion = fechaServidor;
        }

        // 1. Actualizar la incidencia
        transaction.update(incidenciaRef, datosActualizados);

        // 2. Registrar el movimiento en la subcoleccion historial_estados
        transaction.set(nuevoHistorialRef, {
            estadoAnterior: estadoActual,
            estadoNuevo: nuevoEstado,
            responsableId: responsableId,
            responsable: usuario.nombre || usuario.email,
            comentario: comentarioLimpio,
            fecha: fechaServidor
        });

        return {
            id: incidenciaId,
            estadoAnterior: estadoActual,
            estadoNuevo: nuevoEstado
        };
    });

    return resultado;
};
