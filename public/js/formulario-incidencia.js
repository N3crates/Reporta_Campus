import { cargarVista, asignarFecha } from './funciones.js';
import { protegerPagina } from './auth.js';
import { obtenerCatalogos, llenarOpciones } from './catalogos-ui.js';
import { obtenerIncidencia, actualizarIncidencia } from './incidencias-ui.js';
import { registrarIncidencia } from './folio.js';
import { puedeEditar } from './permisos.js';
import { mensajeError, mostrarMensaje, crearError } from './mensajes.js';
import {
    validarIncidencia,
    mostrarErroresFormulario,
    limpiarErroresFormulario
} from './validaciones.js';

export async function iniciarFormulario(edicion) {
    const alerta = document.getElementById('error-alert');
    const carga = document.getElementById('cargando-formulario');
    try {
        const usuario = await protegerPagina();
        if (!usuario) {
            return;
        }
        const id = new URLSearchParams(window.location.search).get('id');
        let incidencia = null;
        if (edicion) {
            if (!id) {
                throw crearError('not-found');
            }
            incidencia = await obtenerIncidencia(id);
            if (!incidencia || incidencia.eliminado) {
                throw crearError('not-found');
            }
            if (!puedeEditar(usuario, incidencia)) {
                throw crearError('permission-denied');
            }
        }
        const [vista, catalogos] = await Promise.all([
            cargarVista('vistas/formulario-incidencia.html'),
            obtenerCatalogos()
        ]);
        if (catalogos.categorias.length === 0 || catalogos.edificios.length === 0) {
            throw crearError(
                'validacion',
                'Aún no están disponibles las categorías o los edificios. Consulta al responsable.'
            );
        }
        document
            .getElementById('formulario-contenido')
            .replaceChildren(vista.content.cloneNode(true));
        const formulario = document.getElementById('form-reporte');
        llenarOpciones(
            formulario.elements.categoriaId,
            catalogos.categorias,
            'Selecciona una categoría',
            incidencia?.categoriaId
        );
        llenarOpciones(
            formulario.elements.edificioId,
            catalogos.edificios,
            'Selecciona un edificio',
            incidencia?.edificioId
        );
        const boton = document.getElementById('btn-submit');
        const exito = document.getElementById('success-alert');
        const contador = document.getElementById('descripcion-contador');
        const etiqueta = edicion ? 'Guardar cambios ↗' : 'Enviar reporte ↗';
        boton.textContent = etiqueta;
        if (edicion) {
            for (const campo of ['titulo', 'descripcion', 'aula', 'prioridad']) {
                formulario.elements[campo].value = incidencia[campo] || '';
            }
            const enlace = 'detalle.html?id=' + encodeURIComponent(id);
            document.getElementById('cancelar-edicion').href = enlace;
            document.getElementById('volver-detalle').href = enlace;
            document.getElementById('volver-detalle').textContent = '← Volver al detalle';
            document.getElementById('edicion-folio').textContent = incidencia.folio;
            document.getElementById('edicion-autor').textContent =
                incidencia.reportanteNombre || incidencia.reportanteId;
            asignarFecha(document.getElementById('edicion-fecha'), incidencia.fechaCreacion, true);
        }
        function actualizarContador() {
            contador.textContent = formulario.elements.descripcion.value.length + ' / 500';
        }
        formulario.elements.descripcion.addEventListener('input', actualizarContador);
        actualizarContador();
        formulario.addEventListener('submit', async function (evento) {
            evento.preventDefault();
            if (boton.disabled) {
                return;
            }
            limpiarErroresFormulario(formulario, alerta);
            exito.classList.add('hidden');
            const datos = Object.fromEntries(new FormData(formulario));
            const errores = validarIncidencia(datos);
            if (errores.length > 0) {
                mostrarErroresFormulario(formulario, alerta, errores);
                return;
            }
            boton.disabled = true;
            boton.textContent = 'Guardando…';
            formulario.setAttribute('aria-busy', 'true');
            try {
                let resultado;
                if (edicion) {
                    resultado = await actualizarIncidencia(
                        id,
                        datos,
                        incidencia.fechaActualizacion
                    );
                } else {
                    resultado = await registrarIncidencia({
                        ...datos,
                        reportanteNombre: usuario.nombre
                    });
                }
                document.getElementById('folio-generado').textContent = resultado.folio;
                document.getElementById('success-detail').href =
                    'detalle.html?id=' + encodeURIComponent(resultado.id);
                exito.classList.remove('hidden');
                // Tras un alta o una edición se continúa desde el registro guardado.
                formulario.hidden = true;
                exito.focus();
            } catch (error) {
                mostrarMensaje(alerta, mensajeError(error));
            } finally {
                boton.disabled = false;
                boton.textContent = etiqueta;
                formulario.removeAttribute('aria-busy');
            }
        });
    } catch (error) {
        mostrarMensaje(alerta, mensajeError(error));
    } finally {
        carga.hidden = true;
    }
}
