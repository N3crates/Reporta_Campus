import { getDemoReports, categorias, edificios } from '../demo-data.js';
import {
    cargarVista,
    asignarTexto,
    mostrarEstado,
    asignarFecha,
    asignarIcono,
    normalizarTexto
} from '../funciones.js';

const formulario = document.getElementById('filtros');
const lista = document.getElementById('lista-incidencias');
let plantilla;

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
    const texto = normalizarTexto(incidencia.titulo + ' ' + incidencia.folio);
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
    asignarTexto(vista, '[data-categoria]', categorias[incidencia.categoriaId]);

    const titulo = asignarTexto(vista, '[data-titulo]', incidencia.titulo);
    titulo.href = enlace;

    const ubicacion = edificios[incidencia.edificioId] + ' · ' + incidencia.aula;
    asignarTexto(vista, '[data-ubicacion]', ubicacion);

    const prioridad = asignarTexto(vista, '[data-prioridad]', incidencia.prioridad);
    prioridad.className = 'text-stone-700';

    if (incidencia.prioridad === 'alta') {
        prioridad.className = 'text-orange-800';
    }

    asignarFecha(vista.querySelector('[data-fecha]'), incidencia.fechaCreacion);

    const detalle = vista.querySelector('[data-detalle]');
    detalle.href = enlace;
    detalle.setAttribute('aria-label', 'Ver detalle: ' + incidencia.titulo);

    return vista;
}

function mostrarIncidencias() {
    const filtros = leerFiltros();
    const incidencias = getDemoReports().filter(function (incidencia) {
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
}

function limpiarFiltros() {
    formulario.reset();
    mostrarIncidencias();
}

async function iniciarListado() {
    try {
        plantilla = await cargarVista('vistas/tarjeta-incidencia.html');
        formulario.addEventListener('input', mostrarIncidencias);
        formulario.addEventListener('change', mostrarIncidencias);
        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();
            mostrarIncidencias();
        });

        document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros);
        document.getElementById('limpiar-vacio').addEventListener('click', limpiarFiltros);
        mostrarIncidencias();
    } catch (error) {
        console.error('No se pudo cargar el listado:', error);
        document.getElementById('resultados-conteo').textContent =
            'No se pudo cargar el listado. Intenta recargar la página.';
    }
}

iniciarListado();
