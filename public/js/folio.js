import { doc, runTransaction, collection, serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from './firebase.js';

function normalizeText(value) {
    return String(value || '').trim();
}

// Genera un folio unico correlativo mediante transaccion y guarda la incidencia
export async function registrarIncidencia(payload) {
    const anioActual = new Date().getFullYear();
    const contadorRef = doc(db, 'contadores', `folios-${anioActual}`);
    const incidenciasColRef = collection(db, 'incidencias');
    const nuevaIncidenciaRef = doc(incidenciasColRef);
    const resultado = await runTransaction(db, async (transaction) => {
        const contadorDoc = await transaction.get(contadorRef);
        let nuevoNumero = 1;

        if (contadorDoc.exists()) {
            nuevoNumero = (contadorDoc.data().ultimoFolio || 0) + 1;
        }

        const consecutivo = String(nuevoNumero).padStart(4, '0');
        const folioGenerado = `RC-${anioActual}-${consecutivo}`;

        // 1. Actualizar el contador de año
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

            // Aqui ira el UID real de auth.currentUser.uid
            reportanteId: 'demo-estudiante',

            fechaCreacion: serverTimestamp(),
            fechaActualizacion: serverTimestamp()
        });

        return {
            id: nuevaIncidenciaRef.id,
            folio: folioGenerado
        };
    });

    return resultado;
}
