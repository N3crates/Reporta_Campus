import { cargarVista, asignarFecha } from './funciones.js';
import { protegerPagina } from './auth.js';
import { obtenerCatalogos, llenarOpciones } from './catalogos-ui.js';
import {
    obtenerIncidencia, actualizarIncidencia, existeIncidenciaReciente
} from './incidencias-ui.js';
import { registrarIncidencia } from './folio.js';
import { puedeEditar } from './permisos.js';
import { mensajeError, mostrarMensaje, ocultarMensaje, crearError } from './mensajes.js';
import {
    validarIncidencia,
    validarCatalogos,
    mostrarErroresFormulario,
    limpiarErroresFormulario
} from './validaciones.js';

export async function iniciarFormulario(edicion) {
    const alerta = document.getElementById('error-alert');
    const carga = document.getElementById('cargando-formulario');
    mostrarMensaje(carga, 'Verificando tu sesión…', { enfocar: false });
    try {
        const usuario = await protegerPagina(['reportante', 'responsable', 'admin']);
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
        mostrarMensaje(carga, 'Cargando formulario…', { enfocar: false });
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
        const avisoDuplicado = document.getElementById('aviso-duplicado');
        let reportePorConfirmar = null;
        formulario.addEventListener('input', function () {
            reportePorConfirmar = null;
            if (avisoDuplicado) {
                ocultarMensaje(avisoDuplicado);
            }
        });
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
            ocultarMensaje(exito);
            if (avisoDuplicado) {
                ocultarMensaje(avisoDuplicado);
            }
            const datos = Object.fromEntries(new FormData(formulario));
            const errores = validarIncidencia(datos);
            if (errores.length > 0) {
                mostrarErroresFormulario(formulario, alerta, errores);
                return;
            }
            boton.disabled = true;
            boton.textContent = 'Validando…';
            mostrarMensaje(carga, 'Validando el reporte…', { enfocar: false });
            formulario.setAttribute('aria-busy', 'true');
            try {
                const erroresCatalogo = await validarCatalogos(datos);
                if (erroresCatalogo.length > 0) {
                    mostrarErroresFormulario(formulario, alerta, erroresCatalogo);
                    return;
                }
                if (!edicion) {
                    const reporte = JSON.stringify(datos);
                    if (reporte !== reportePorConfirmar &&
                        await existeIncidenciaReciente(usuario.uid, datos)) {
                        reportePorConfirmar = reporte;
                        mostrarMensaje(
                            avisoDuplicado,
                            'Ya enviaste un reporte con ese título, edificio y aula en los últimos ' +
                            '5 minutos. Vuelve a pulsar Enviar reporte para confirmar.'
                        );
                        return;
                    }
                }
                boton.textContent = 'Guardando…';
                mostrarMensaje(carga, 'Guardando el reporte…', { enfocar: false });
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
                // Tras un alta o una edición se continúa desde el registro guardado.
                formulario.hidden = true;
                mostrarMensaje(exito);
            } catch (error) {
                mostrarMensaje(alerta, mensajeError(error));
            } finally {
                boton.disabled = false;
                boton.textContent = etiqueta;
                formulario.removeAttribute('aria-busy');
                ocultarMensaje(carga);
            }
        });
    } catch (error) {
        mostrarMensaje(alerta, mensajeError(error));
    } finally {
        ocultarMensaje(carga);
    }
}
