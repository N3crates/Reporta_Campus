import {
    doc,
    runTransaction,
    collection,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db, auth } from './firebase.js';
import { validarIncidencia } from './validaciones.js';
import { crearError } from './mensajes.js';

function normalizeText(value) {
    return String(value || '').trim();
}

// Genera un folio unico correlativo mediante transaccion y guarda la incidencia
export async function registrarIncidencia(payload, usuarioId = null) {
    const errores = validarIncidencia(payload);
    if (errores.length > 0) {
        throw crearError('validacion', errores[0].mensaje);
    }
    const anioActual = new Date().getFullYear();

    const contadorRef = doc(db, 'contadores', `folios-${anioActual}`);
    const incidenciasColRef = collection(db, 'incidencias');
    const nuevaIncidenciaRef = doc(incidenciasColRef);

    // Referencia para el primer movimiento de historial
    const primerHistorialRef = doc(
        collection(db, 'incidencias', nuevaIncidenciaRef.id, 'historial_estados')
    );

    // UID del usuario autenticado
    const reportanteFinal = auth.currentUser?.uid;

    if (!reportanteFinal || (usuarioId && usuarioId !== reportanteFinal)) {
        throw crearError('unauthenticated', 'Debes iniciar sesión para registrar una incidencia.');
    }

    const resultado = await runTransaction(db, async (transaction) => {
        const contadorDoc = await transaction.get(contadorRef);
        let nuevoNumero = 1;

        if (contadorDoc.exists()) {
            nuevoNumero = (contadorDoc.data().ultimoFolio || 0) + 1;
        }

        const consecutivo = String(nuevoNumero).padStart(4, '0');
        const folioGenerado = `RC-${anioActual}-${consecutivo}`;
        const fechaServidor = serverTimestamp();

        // 1. Actualizar el contador del anio
        transaction.set(
            contadorRef,
            {
                ultimoFolio: nuevoNumero,
                ultimaIncidenciaId: nuevaIncidenciaRef.id
            },
            { merge: true }
        );

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
            reportanteId: reportanteFinal,
            reportanteNombre: normalizeText(payload.reportanteNombre || 'Reportante'),
            ultimoMovimientoId: primerHistorialRef.id,
            fechaCreacion: fechaServidor,
            fechaActualizacion: fechaServidor
        });

        // 3. Crear el primer movimiento del historial con estadoAnterior en null
        transaction.set(primerHistorialRef, {
            estadoAnterior: null,
            estadoNuevo: 'reportado',
            responsableId: reportanteFinal,
            responsable: normalizeText(payload.reportanteNombre || 'Reportante'),
            comentario: 'Incidencia reportada en el sistema',
            fecha: fechaServidor
        });

        return {
            id: nuevaIncidenciaRef.id,
            folio: folioGenerado
        };
    });

    return resultado;
}
