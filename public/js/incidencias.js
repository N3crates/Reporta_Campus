import {
    db,
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
    runTransaction,
    serverTimestamp
} from './firebase.js';
import { where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { protegerPagina } from './auth.js';
import { esPersonal, puedeEditar } from './permisos.js';
import { validarIncidencia } from './validaciones.js';
import { crearError } from './mensajes.js';

function fechaAISO(valor) {
    if (!valor) {
        return '';
    }
    if (typeof valor.toDate === 'function') {
        return valor.toDate().toISOString();
    }
    return String(valor);
}

function normalizar(documento) {
    const datos = documento.data();
    return {
        ...datos,
        id: documento.id,
        fechaCreacion: fechaAISO(datos.fechaCreacion),
        fechaActualizacion: fechaAISO(datos.fechaActualizacion),
        fechaResolucion: fechaAISO(datos.fechaResolucion)
    };
}

export async function obtenerIncidencias() {
    const usuario = await protegerPagina();
    if (!usuario) {
        return [];
    }
    const restricciones = [orderBy('fechaCreacion', 'desc')];
    if (!esPersonal(usuario)) {
        restricciones.unshift(where('reportanteId', '==', usuario.uid));
    }
    const resultado = await getDocs(query(collection(db, 'incidencias'), ...restricciones));
    return resultado.docs.map(normalizar);
}

export async function obtenerIncidencia(id) {
    const documento = await getDoc(doc(db, 'incidencias', id));
    if (!documento.exists()) {
        return null;
    }
    const incidencia = normalizar(documento);
    try {
        const movimientos = await getDocs(
            query(collection(db, 'incidencias', id, 'historial_estados'), orderBy('fecha', 'asc'))
        );
        incidencia.historial = movimientos.docs.map(function (movimiento) {
            return {
                ...movimiento.data(),
                id: movimiento.id,
                fecha: fechaAISO(movimiento.data().fecha)
            };
        });
    } catch (error) {
        incidencia.historial = [];
        incidencia.errorHistorial = error;
    }
    return incidencia;
}

export async function actualizarIncidencia(id, datos, version) {
    const usuario = await protegerPagina();
    if (!usuario) {
        throw crearError('unauthenticated');
    }
    const errores = validarIncidencia(datos);
    if (errores.length > 0) {
        throw crearError('validacion', errores[0].mensaje);
    }
    const referencia = doc(db, 'incidencias', id);
    return runTransaction(db, async function (transaccion) {
        const documento = await transaccion.get(referencia);
        if (!documento.exists()) {
            throw crearError('not-found');
        }
        const actual = normalizar(documento);
        if (!puedeEditar(usuario, actual)) {
            throw crearError('permission-denied');
        }
        if (actual.fechaActualizacion !== version) {
            throw crearError('conflict');
        }
        transaccion.update(referencia, {
            titulo: datos.titulo.trim(),
            descripcion: datos.descripcion.trim(),
            categoriaId: datos.categoriaId,
            edificioId: datos.edificioId,
            aula: datos.aula.trim(),
            prioridad: datos.prioridad,
            fechaActualizacion: serverTimestamp()
        });
        return { id, folio: actual.folio };
    });
}

export async function eliminarIncidencia(id, version) {
    const usuario = await protegerPagina(['admin']);
    if (!usuario) {
        throw crearError('unauthenticated');
    }
    // Se retira del listado conservando el historial para auditoría.
    const referencia = doc(db, 'incidencias', id);
    return runTransaction(db, async function (transaccion) {
        const documento = await transaccion.get(referencia);
        if (!documento.exists()) {
            throw crearError('not-found');
        }
        if (fechaAISO(documento.data().fechaActualizacion) !== version) {
            throw crearError('conflict');
        }
        transaccion.update(referencia, {
            eliminado: true,
            eliminadoPor: usuario.uid,
            fechaEliminacion: serverTimestamp(),
            fechaActualizacion: serverTimestamp()
        });
    });
}
