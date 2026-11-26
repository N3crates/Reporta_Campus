import { mostrarAntiguedad } from '../antiguedad.js';
import { obtenerIncidencias } from '../incidencias-ui.js';
import { protegerPagina } from '../auth.js';
import { obtenerCatalogos, llenarOpciones, nombreCatalogo } from '../catalogos-ui.js';
import { mensajeError, mostrarMensaje } from '../mensajes.js';
import {
    cargarVista,
    asignarTexto,
    mostrarEstado,
    asignarFecha,
    asignarIcono,
    normalizarTexto
} from '../funciones.js';
import { usuarioActual } from '../auth.js';

usuarioActual().then((usuario) => {
    if (!usuario) {
        window.location.href = 'login.html';
    }
});

const formulario = document.getElementById('filtros');
const lista = document.getElementById('lista-incidencias');
let plantilla;
let todas = [];
let numeroConsulta = 0;
let catalogos = { categorias: [], edificios: [] };

function nombreCategoria(id) {
    return nombreCatalogo(catalogos.categorias, id);
}

function nombreEdificio(id) {
    return nombreCatalogo(catalogos.edificios, id);
}

function leerFiltros() {
    return {
        busqueda: normalizarTexto(document.getElementById('buscar').value),
        estado: document.getElementById('estado').value,
        prioridad: document.getElementById('prioridad').value,
        categoria: document.getElementById('categoria').value,
        edificio: document.getElementById('edificio').value
    };
}

function coincideConFiltros(incidencia, filtros) {
    const texto = normalizarTexto((incidencia.titulo ?? '') + ' ' + (incidencia.folio ?? ''));
    const porTexto = filtros.busqueda === '' || texto.includes(filtros.busqueda);
    const porEstado = filtros.estado === '' || incidencia.estado === filtros.estado;
    const porPrioridad = filtros.prioridad === '' || incidencia.prioridad === filtros.prioridad;
    const porCategoria = filtros.categoria === '' || incidencia.categoriaId === filtros.categoria;
    const porEdificio = filtros.edificio === '' || incidencia.edificioId === filtros.edificio;

    return porTexto && porEstado && porPrioridad && porCategoria && porEdificio;
}

function crearTarjeta(incidencia) {
    const vista = plantilla.content.cloneNode(true);
    const enlace = 'detalle.html?id=' + encodeURIComponent(incidencia.id);

    asignarIcono(vista.querySelector('[data-icono]'), incidencia.categoriaId);
    mostrarEstado(vista.querySelector('[data-estado]'), incidencia.estado);
    asignarTexto(vista, '[data-folio]', incidencia.folio);
    asignarTexto(vista, '[data-categoria]', nombreCategoria(incidencia.categoriaId));

    const titulo = asignarTexto(vista, '[data-titulo]', incidencia.titulo);
    titulo.href = enlace;

    const ubicacion = nombreEdificio(incidencia.edificioId) + ' · ' + (incidencia.aula ?? '');
    asignarTexto(vista, '[data-ubicacion]', ubicacion);

    const prioridad = asignarTexto(vista, '[data-prioridad]', incidencia.prioridad);
    prioridad.className = 'text-stone-700';

    if (incidencia.prioridad === 'alta') {
        prioridad.className = 'text-orange-800';
    }

    asignarFecha(vista.querySelector('[data-fecha]'), incidencia.fechaCreacion);
    mostrarAntiguedad(vista.querySelector('[data-antiguedad]'), incidencia);

    const detalle = vista.querySelector('[data-detalle]');
    detalle.href = enlace;
    detalle.setAttribute('aria-label', 'Ver detalle: ' + incidencia.titulo);

    return vista;
}

function mostrarIncidencias() {
    const filtros = leerFiltros();
    const incidencias = todas.filter(function (incidencia) {
        return coincideConFiltros(incidencia, filtros);
    });

    const cantidad = incidencias.length;
    let mensaje = cantidad + ' incidencias encontradas';

    if (cantidad === 1) {
        mensaje = '1 incidencia encontrada';
    }

    document.getElementById('resultados-conteo').textContent = mensaje;
    document.getElementById('estado-vacio').classList.toggle('hidden', cantidad !== 0);
    lista.replaceChildren();

    for (const incidencia of incidencias) {
        lista.append(crearTarjeta(incidencia));
    }

    const parametros = new URLSearchParams();
    for (const campo of ['buscar', 'estado', 'prioridad', 'categoria', 'edificio']) {
        const valor = document.getElementById(campo).value;
        if (valor) {
            parametros.set(campo, valor);
        }
    }
    const consulta = parametros.toString();
    let direccion = 'incidencias.html';
    if (consulta) {
        direccion += '?' + consulta;
    }
    window.history.replaceState(null, '', direccion);
}

async function consultarFiltros() {
    const numero = ++numeroConsulta;
    const filtros = leerFiltros();
    const alerta = document.getElementById('error-listado');
    alerta.classList.add('hidden');
    document.getElementById('estado-vacio').classList.add('hidden');
    document.getElementById('resultados-conteo').textContent = 'Consultando incidencias…';
    lista.setAttribute('aria-busy', 'true');
    try {
        const incidencias = await obtenerIncidencias({
            estado: filtros.estado,
            prioridad: filtros.prioridad,
            categoriaId: filtros.categoria,
            edificioId: filtros.edificio
        });
        if (numero !== numeroConsulta) {
            return;
        }
        todas = incidencias;
        mostrarIncidencias();
    } catch (error) {
        if (numero !== numeroConsulta) {
            return;
        }
        lista.replaceChildren();
        mostrarMensaje(alerta, mensajeError(error));
        document.getElementById('resultados-conteo').textContent =
            'No se pudo consultar el listado.';
        document.getElementById('reintentar-listado').hidden = false;
    } finally {
        if (numero === numeroConsulta) {
            lista.removeAttribute('aria-busy');
        }
    }
}

function limpiarFiltros() {
    formulario.reset();
    consultarFiltros();
}

async function iniciarListado() {
    const alerta = document.getElementById('error-listado');
    const reintentar = document.getElementById('reintentar-listado');
    formulario.inert = true;
    alerta.classList.add('hidden');
    reintentar.hidden = true;
    document.getElementById('estado-vacio').classList.add('hidden');
    try {
        const usuario = await protegerPagina();
        if (!usuario) {
            return;
        }
        document.getElementById('resultados-conteo').textContent = 'Cargando incidencias…';
        plantilla = await cargarVista('vistas/tarjeta-incidencia.html');
        catalogos = await obtenerCatalogos();
        llenarOpciones(
            document.getElementById('categoria'),
            catalogos.categorias,
            'Todas las categorías'
        );
        llenarOpciones(
            document.getElementById('edificio'),
            catalogos.edificios,
            'Todos los edificios'
        );
        const parametros = new URLSearchParams(window.location.search);
        for (const campo of ['buscar', 'estado', 'prioridad', 'categoria', 'edificio']) {
            document.getElementById(campo).value = parametros.get(campo) || '';
        }

        formulario.oninput = function (evento) {
            if (evento.target.id === 'buscar') {
                mostrarIncidencias();
            }
        };
        formulario.onchange = function (evento) {
            if (evento.target.id !== 'buscar') {
                consultarFiltros();
            }
        };
        formulario.onsubmit = function (evento) {
            evento.preventDefault();
            consultarFiltros();
        };

        document.getElementById('limpiar-filtros').onclick = limpiarFiltros;
        document.getElementById('limpiar-vacio').onclick = limpiarFiltros;
        await consultarFiltros();
    } catch (error) {
        lista.replaceChildren();
        mostrarMensaje(alerta, mensajeError(error));
        reintentar.hidden = false;
        document.getElementById('resultados-conteo').textContent = 'No se pudo cargar el listado.';
    } finally {
        formulario.inert = false;
    }
}

document.getElementById('reintentar-listado').addEventListener('click', iniciarListado);
iniciarListado();
