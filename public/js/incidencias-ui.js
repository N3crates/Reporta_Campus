import { db, doc, runTransaction, serverTimestamp } from './firebase.js';
import { protegerPagina } from './auth.js';
import { puedeEditar } from './permisos.js';
import { validarIncidencia } from './validaciones.js';
import { crearError } from './mensajes.js';
import {
    obtenerIncidencias as consultarIncidencias,
    obtenerIncidencia as consultarIncidencia
} from './incidencias.js';

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

export async function obtenerIncidencias(filtros = {}) {
    const incidencias = await consultarIncidencias(filtros);
    return incidencias.filter(function (incidencia) {
        return !incidencia.eliminado;
    });
}

export async function obtenerIncidencia(id) {
    const incidencia = await consultarIncidencia(id);
    if (!incidencia) {
        return null;
    }
    return {
        ...incidencia,
        fechaActualizacion: fechaAISO(incidencia.fechaActualizacion),
        fechaResolucion: fechaAISO(incidencia.fechaResolucion)
    };
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
