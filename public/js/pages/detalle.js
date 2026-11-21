import { getDemoReports, categorias, edificios } from '../demo-data.js';
import {
    cargarVista,
    asignarTexto,
    mostrarEstado,
    asignarFecha,
    asignarIcono,
    estados
} from '../funciones.js';

const contenido = document.getElementById('detalle-contenido');

function crearMovimiento(movimiento, indice, cantidad, plantilla) {
    const vista = plantilla.content.cloneNode(true);
    const fila = vista.querySelector('li');

    if (indice < cantidad - 1) {
        fila.classList.add('border-l', 'border-stone-200', 'pb-8');
    }

    const indicador = vista.querySelector('[data-indicador]');
    let color = 'bg-[#8c6e39]';

    if (movimiento.estadoNuevo === 'resuelto') {
        color = 'bg-emerald-600';
    }

    indicador.classList.add(color);
    asignarTexto(vista, '[data-estado]', estados[movimiento.estadoNuevo].label);
    asignarFecha(vista.querySelector('[data-fecha]'), movimiento.fecha, true);
    asignarTexto(vista, '[data-comentario]', movimiento.comentario);
    asignarTexto(vista, '[data-responsable]', movimiento.responsable);
    return vista;
}

async function mostrarDetalle(incidencia) {
    const plantilla = await cargarVista('vistas/detalle-incidencia.html');
    const plantillaMovimiento = await cargarVista('vistas/movimiento-historial.html');
    const vista = plantilla.content.cloneNode(true);

    document.title = incidencia.folio + ' · ReportaCampus';
    asignarTexto(vista, '[data-folio]', incidencia.folio);
    asignarTexto(vista, '[data-titulo]', incidencia.titulo);
    asignarFecha(vista.querySelector('[data-fecha]'), incidencia.fechaCreacion, true);
    mostrarEstado(vista.querySelector('[data-estado]'), incidencia.estado);
    asignarIcono(vista.querySelector('[data-icono]'), incidencia.categoriaId);
    asignarTexto(vista, '[data-categoria]', categorias[incidencia.categoriaId]);

    const prioridad = incidencia.prioridad[0].toUpperCase() + incidencia.prioridad.slice(1);
    asignarTexto(vista, '[data-prioridad]', prioridad);
    asignarTexto(vista, '[data-edificio]', edificios[incidencia.edificioId]);
    asignarTexto(vista, '[data-aula]', incidencia.aula);
    asignarTexto(vista, '[data-descripcion]', incidencia.descripcion);

    const movimientos = [...incidencia.historial];
    movimientos.sort(function (anterior, siguiente) {
        return new Date(anterior.fecha) - new Date(siguiente.fecha);
    });

    const historial = vista.querySelector('[data-historial]');

    movimientos.forEach(function (movimiento, indice) {
        const fila = crearMovimiento(movimiento, indice, movimientos.length, plantillaMovimiento);
        historial.append(fila);
    });

    contenido.replaceChildren(vista);
}

async function iniciarDetalle() {
    try {
        const parametros = new URLSearchParams(window.location.search);
        const id = parametros.get('id');
        const incidencia = getDemoReports().find(function (elemento) {
            return elemento.id === id;
        });

        if (!incidencia) {
            const plantilla = await cargarVista('vistas/no-encontrado.html');
            document.title = 'Incidencia no encontrada · ReportaCampus';
            contenido.replaceChildren(plantilla.content.cloneNode(true));
            return;
        }

        await mostrarDetalle(incidencia);
    } catch (error) {
        console.error('No se pudo cargar el detalle:', error);
        contenido.textContent = 'No se pudo cargar el detalle. Intenta recargar la página.';
    }
}

iniciarDetalle();
