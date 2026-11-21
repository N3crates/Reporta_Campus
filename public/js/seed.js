// Carga los datos semilla (ficticios) en Firestore. Solo para desarrollo.
import {
    doc,
    getDoc,
    writeBatch,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from './firebase.js';

const btn = document.getElementById('cargar');
const log = document.getElementById('log');
function escribir(texto) {
    log.textContent += texto + '\n';
}
const aFecha = (iso) => Timestamp.fromDate(new Date(iso));

async function cargarSemilla() {
    const respuesta = await fetch('data/seed.json');
    if (!respuesta.ok) {
        throw new Error('No se pudo leer data/seed.json');
    }
    const seed = await respuesta.json();
    const batch = writeBatch(db);
    let total = 0;

    // Catálogos: IDs fijos, por lo que cargar dos veces no duplica nada
    for (const [id, datos] of Object.entries(seed.categorias)) {
        batch.set(doc(db, 'categorias', id), datos);
        total++;
    }
    for (const [id, datos] of Object.entries(seed.edificios)) {
        batch.set(doc(db, 'edificios', id), datos);
        total++;
    }

    // Incidencias con su subcolección historial_estados
    for (const [id, { historial, ...datos }] of Object.entries(seed.incidencias)) {
        batch.set(doc(db, 'incidencias', id), {
            ...datos,
            fechaCreacion: aFecha(datos.fechaCreacion),
            fechaActualizacion: aFecha(datos.fechaActualizacion),
            ...(datos.fechaResolucion && { fechaResolucion: aFecha(datos.fechaResolucion) })
        });
        total++;
        historial.forEach((paso, i) => {
            const idPaso = String(i + 1).padStart(2, '0');
            batch.set(doc(db, 'incidencias', id, 'historial_estados', idPaso), {
                ...paso,
                fecha: aFecha(paso.fecha)
            });
            total++;
        });
    }

    // Contador de folios: solo se crea si no existe, para no reiniciar folios reales
    for (const [id, datos] of Object.entries(seed.contadores)) {
        const ref = doc(db, 'contadores', id);
        if ((await getDoc(ref)).exists()) {
            escribir(`contadores/${id} ya existe: no se modifica.`);
        } else {
            batch.set(ref, datos);
            total++;
        }
    }

    await batch.commit();
    escribir(`Listo: ${total} documentos escritos.`);
}

btn.addEventListener('click', async () => {
    if (!confirm('Se cargarán datos de demostración en Firestore. ¿Continuar?')) {
        return;
    }
    btn.disabled = true;
    log.textContent = '';
    try {
        await cargarSemilla();
    } catch (error) {
        escribir('Error: ' + error.message);
        escribir(
            'Revisa la configuración y los permisos del entorno de pruebas. No abras las reglas de forma global.'
        );
    } finally {
        btn.disabled = false;
    }
});
