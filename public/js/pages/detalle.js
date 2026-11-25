import { obtenerIncidencia, eliminarIncidencia } from '../incidencias-ui.js';
import { obtenerCatalogos, nombreCatalogo } from '../catalogos-ui.js';
import {
    cargarVista,
    asignarTexto,
    mostrarEstado,
    asignarFecha,
    asignarIcono,
    estados
} from '../funciones.js';
import { protegerPagina } from '../auth.js';
import { esPersonal, puedeEditar } from '../permisos.js';
import { cambiarEstado } from '../estados.js';
import { calcularAntiguedad } from '../antiguedad.js';
import { mensajeError, mostrarMensaje, crearError } from '../mensajes.js';

const contenido = document.getElementById('detalle-contenido');

function crearMovimiento(movimiento, indice, cantidad, plantilla) {
    const vista = plantilla.content.cloneNode(true);
    if (indice < cantidad - 1) {
        vista.querySelector('li').classList.add('border-l', 'border-stone-200', 'pb-8');
    }
    let color = 'bg-[#8c6e39]';
    if (movimiento.estadoNuevo === 'resuelto') {
        color = 'bg-emerald-600';
    }
    vista.querySelector('[data-indicador]').classList.add(color);
    asignarTexto(
        vista,
        '[data-estado]',
        estados[movimiento.estadoNuevo]?.label || 'Estado desconocido'
    );
    asignarFecha(vista.querySelector('[data-fecha]'), movimiento.fecha, true);
    asignarTexto(vista, '[data-comentario]', movimiento.comentario || '');
    asignarTexto(
        vista,
        '[data-responsable]',
        movimiento.responsable || movimiento.responsableId || 'Sin responsable'
    );
    return vista;
}

async function prepararGestion(incidencia, usuario) {
    if (!esPersonal(usuario) || incidencia.estado === 'resuelto') {
        return;
    }
    const plantilla = await cargarVista('vistas/gestion-incidencia.html');
    contenido.append(plantilla.content.cloneNode(true));
    const selector = document.getElementById('nuevo-estado');
    if (incidencia.estado === 'reportado') {
        selector.add(new Option('En proceso', 'en_proceso'));
    } else if (incidencia.estado === 'en_proceso') {
        selector.add(new Option('Resuelto', 'resuelto'));
    } else {
        selector.disabled = true;
        document.getElementById('btn-guardar-estado').disabled = true;
        return;
    }
    const formulario = document.getElementById('form-actualizar-estado');
    formulario.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const boton = document.getElementById('btn-guardar-estado');
        const alerta = document.getElementById('error-gestion');
        const comentario = document.getElementById('comentario-seguimiento').value.trim();
        if (boton.disabled) {
            return;
        }
        alerta.classList.add('hidden');
        if (!comentario || comentario.length > 500) {
            mostrarMensaje(
                alerta,
                'Describe la atención realizada, en un máximo de 500 caracteres.'
            );
            document.getElementById('comentario-seguimiento').focus();
            return;
        }
        boton.disabled = true;
        boton.textContent = 'Guardando seguimiento…';
        try {
            await cambiarEstado(incidencia.id, selector.value, comentario, usuario.uid);
            await iniciarDetalle('Seguimiento actualizado correctamente.');
        } catch (error) {
            mostrarMensaje(alerta, mensajeError(error));
        } finally {
            boton.disabled = false;
            boton.textContent = 'Guardar seguimiento ↗';
        }
    });
}

async function mostrarDetalle(incidencia, usuario, catalogos, aviso) {
    const [plantilla, plantillaMovimiento] = await Promise.all([
        cargarVista('vistas/detalle-incidencia.html'),
        cargarVista('vistas/movimiento-historial.html')
    ]);
    const vista = plantilla.content.cloneNode(true);
    document.title = incidencia.folio + ' · ReportaCampus';
    asignarTexto(vista, '[data-folio]', incidencia.folio);
    asignarTexto(vista, '[data-titulo]', incidencia.titulo);
    asignarFecha(vista.querySelector('[data-fecha]'), incidencia.fechaCreacion, true);
    mostrarEstado(vista.querySelector('[data-estado]'), incidencia.estado);
    asignarIcono(vista.querySelector('[data-icono]'), incidencia.categoriaId);
    asignarTexto(
        vista,
        '[data-categoria]',
        nombreCatalogo(catalogos.categorias, incidencia.categoriaId)
    );
    asignarTexto(vista, '[data-prioridad]', incidencia.prioridad);
    asignarTexto(
        vista,
        '[data-edificio]',
        nombreCatalogo(catalogos.edificios, incidencia.edificioId)
    );
    asignarTexto(vista, '[data-aula]', incidencia.aula);
    asignarTexto(vista, '[data-descripcion]', incidencia.descripcion);
    const antiguedad = calcularAntiguedad(incidencia.fechaCreacion, incidencia.fechaResolucion);
    let textoAntiguedad = 'Fecha no disponible';
    if (antiguedad) {
        textoAntiguedad = antiguedad.dias + ' días · ' + antiguedad.rango;
        if (incidencia.estado === 'resuelto') {
            textoAntiguedad += ' · al resolver';
        }
    }
    asignarTexto(vista, '[data-antiguedad]', textoAntiguedad);
    const historial = vista.querySelector('[data-historial]');
    if (incidencia.errorHistorial || incidencia.historial.length === 0) {
        const mensaje = document.createElement('li');
        mensaje.className = 'text-sm text-stone-500';
        mensaje.textContent = 'Aún no hay movimientos registrados.';
        if (incidencia.errorHistorial) {
            mensaje.textContent =
                'No se pudo consultar el historial. ' + mensajeError(incidencia.errorHistorial);
        }
        historial.append(mensaje);
    } else {
        incidencia.historial.forEach(function (movimiento, indice) {
            historial.append(
                crearMovimiento(
                    movimiento,
                    indice,
                    incidencia.historial.length,
                    plantillaMovimiento
                )
            );
        });
    }
    const editar = vista.querySelector('#editar-incidencia');
    editar.hidden = !puedeEditar(usuario, incidencia);
    editar.href = 'editar.html?id=' + encodeURIComponent(incidencia.id);
    const eliminar = vista.querySelector('#eliminar-incidencia');
    eliminar.hidden = usuario.rol !== 'admin';
    eliminar.addEventListener('click', async function () {
        if (
            !window.confirm(
                '¿Retirar la incidencia ' +
                    incidencia.folio +
                    ' del listado? Se conservará su historial.'
            )
        ) {
            return;
        }
        eliminar.disabled = true;
        try {
            await eliminarIncidencia(incidencia.id, incidencia.fechaActualizacion);
            window.location.href = 'incidencias.html?retirada=1';
        } catch (error) {
            const alerta = document.getElementById('aviso-detalle');
            alerta.className = 'form-alert form-alert-error mb-6';
            mostrarMensaje(alerta, mensajeError(error));
            eliminar.disabled = false;
        }
    });
    contenido.replaceChildren(vista);
    const alerta = document.createElement('p');
    alerta.id = 'aviso-detalle';
    alerta.tabIndex = -1;
    alerta.setAttribute('role', 'status');
    alerta.className = 'hidden form-alert form-alert-success mb-6';
    contenido.prepend(alerta);
    if (aviso) {
        mostrarMensaje(alerta, aviso);
    }
    await prepararGestion(incidencia, usuario);
}

async function iniciarDetalle(aviso = '') {
    try {
        const usuario = await protegerPagina();
        if (!usuario) {
            return;
        }
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) {
            throw crearError('not-found');
        }
        const [incidencia, catalogos] = await Promise.all([
            obtenerIncidencia(id),
            obtenerCatalogos()
        ]);
        if (!incidencia || incidencia.eliminado) {
            throw crearError('not-found');
        }
        await mostrarDetalle(incidencia, usuario, catalogos, aviso);
    } catch (error) {
        if (error.code === 'not-found') {
            const vista = await cargarVista('vistas/no-encontrado.html');
            contenido.replaceChildren(vista.content.cloneNode(true));
            return;
        }
        const mensaje = document.createElement('p');
        mensaje.className = 'form-alert form-alert-error';
        mensaje.setAttribute('role', 'alert');
        mensaje.textContent = mensajeError(error);
        const reintentar = document.createElement('button');
        reintentar.type = 'button';
        reintentar.className = 'btn-secondary mt-5';
        reintentar.textContent = 'Reintentar carga';
        reintentar.addEventListener('click', function () {
            iniciarDetalle();
        });
        contenido.replaceChildren(mensaje, reintentar);
    }
}

iniciarDetalle();
