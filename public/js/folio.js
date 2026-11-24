import {
    doc,
    runTransaction,
    collection,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db, auth } from './firebase.js'

function normalizeText(value) {
    return String(value || '').trim()
}

// Genera un folio único correlativo mediante transacción, guarda la incidencia y registra su primer historial
export async function registrarIncidencia(payload, usuarioId = null) {
    const uidActual = usuarioId || auth.currentUser?.uid || payload.reportanteId
    if (!uidActual) {
        throw new Error('Debes iniciar sesión para registrar una incidencia.')
    }

    const anioActual = new Date().getFullYear();
    const contadorRef = doc(db, 'contadores', `folios-${anioActual}`);
    const incidenciasColRef = collection(db, 'incidencias');
    const nuevaIncidenciaRef = doc(incidenciasColRef);

    // Referencia para el primer movimiento de historial
    const primerHistorialRef = doc(collection(db, 'incidencias', nuevaIncidenciaRef.id, 'historial_estados'));

    const resultado = await runTransaction(db, async (transaction) => {
        const contadorDoc = await transaction.get(contadorRef);
        let nuevoNumero = 1;

        if (contadorDoc.exists()) {
            nuevoNumero = (contadorDoc.data().ultimoFolio || 0) + 1;
        }

        const consecutivo = String(nuevoNumero).padStart(4, '0');
        const folioGenerado = `RC-${anioActual}-${consecutivo}`;
        const fechaServidor = serverTimestamp();

        // 1. Actualizar el contador del año
        transaction.set(contadorRef, { ultimoFolio: nuevoNumero }, { merge: true });

        // 2. Guardar la incidencia en Firestore
        transaction.set(nuevaIncidenciaRef, {
            folio: folioGenerado,
            titulo: normalizeText(payload.titulo),
            descripcion: normalizeText(payload.descripcion),
            categoriaId: payload.categoriaId,
            edificioId: payload.edificioId,
            aula: normalizeText(payload.aula),
            prioridad: payload.prioridad || 'media',
            estado: 'reportado',
            reportanteId: uidActual,
            reportanteNombre: payload.reportanteNombre || auth.currentUser?.displayName || '',
            correoReportante: payload.correoReportante || auth.currentUser?.email || '',
            fechaCreacion: fechaServidor,
            fechaActualizacion: fechaServidor
        })

        // 3. Crear el primer movimiento del historial con estadoAnterior en null
        transaction.set(primerHistorialRef, {
            estadoAnterior: null,
            estadoNuevo: 'reportado',
            responsableId: uidActual,
            responsable: payload.reportanteNombre || auth.currentUser?.displayName || auth.currentUser?.email || '',
            comentario: 'Incidencia reportada en el sistema',
            fecha: fechaServidor
        })

        return {
            id: nuevaIncidenciaRef.id,
            folio: folioGenerado
        }
    })

    return resultado
}