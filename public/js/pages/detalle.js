import { obtenerMapaCatalogos } from '../catalogos.js'
import { obtenerIncidencia, actualizarIncidencia } from '../incidencias.js';
import { cargarVista, asignarTexto, mostrarEstado, asignarFecha, asignarIcono, estados } from '../funciones.js';
import { usuarioActual } from '../auth.js';
import { db } from '../firebase.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const contenido = document.getElementById('detalle-contenido');
const nombreCategoria = id => categorias[id] ?? id ?? 'Sin categoría';
const nombreEdificio = id => edificios[id] ?? id ?? 'Sin edificio';
const capitalizar = texto => texto ? texto[0].toUpperCase() + texto.slice(1) : 'Sin definir';
const etiquetaEstado = estado => estados?.[estado]?.label ?? estado ?? 'Sin estado';

let categoriasMap = {}
let edificiosMap = {}

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
    asignarTexto(vista, '[data-estado]', etiquetaEstado(movimiento.estadoNuevo));
    asignarFecha(vista.querySelector('[data-fecha]'), movimiento.fecha, true);
    asignarTexto(vista, '[data-comentario]', movimiento.comentario ?? '');
    asignarTexto(vista, '[data-responsable]', movimiento.responsable ?? movimiento.responsableId ?? '');
    return vista;
}

function panelGestion(incidencia, usuario){
    const seccion = document.createElement('section')
    seccion.className = 'panel p-6 mt-6 border-l-4 border-[#ffd300]'
    seccion.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h2 class="text-base font-extrabold text-[#0a263d]">
                    Gestion de seguimiento
                </h2>
                <p class="text-sm text-slate-500 mt-1">
                    Actualizar el estado de atencion de esta incidencia y agregar una nota al historial.
                </p>
            </div>
            <button 
                type="button" 
                id="btn-toggle-gestion" 
                aria-expanded="false" 
                aria-controls="contenedor-form-gestion" 
                class="btn-secondary shrink-0"
                >
                <span id="texto-toggle-gestion">
                    Actualizar estado
                </span>
                <span id="icono-toggle-gestion" aria-hidden="true">▾</span>
            </button>
        </div>
        <div id="contenedor-form-gestion" class="hidden border-t border-slate-100 mt-5 pt-5">
            <form id="form-actualizar-estado" class="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label for="nuevo-estado" class="field-label">
                        Nuevo estado
                    </label>
                    <select id="nuevo-estado" class="field">
                        <option value="reportado" ${ incidencia.estado === 'reportado' ? 'selected' : '' }>
                            Reportado
                        </option>
                        <option value="en_proceso" ${ incidencia.estado === 'en_proceso' ? 'selected' : '' }>
                            En proceso
                        </option>
                        <option value="resuelto" ${ incidencia.estado === 'resuelto' ? 'selected' : '' }>
                            Resuelto
                        </option>
                    </select>
                </div>
                <div>
                    <label for="nueva-prioridad" class="field-label">
                        Prioridad
                    </label>
                    <select id="nueva-prioridad" class="field">
                        <option value="baja" ${ incidencia.prioridad === 'baja' ? 'selected' : '' }>
                            Baja
                        </option>
                        <option value="media" ${ incidencia.prioridad === 'media' ? 'selected' : '' }>
                            Media
                        </option>
                        <option value="alta" ${ incidencia.prioridad === 'alta' ? 'selected' : '' }>
                            Alta
                        </option>
                    </select>
                </div>
                <div class="sm:col-span-2">
                    <label for="comentario-seguimiento" class="field-label">
                        Comentario de actualizacion
                    </label>
                    <input type="text" id="comentario-seguimiento" required maxlength="250" class="field" />
                </div>
                <div class="sm:col-span-2 flex items-center justify-between gap-3">
                    <span id="msg-gestion" class="text-xs font-semibold"></span>
                    <button type="submit" id="btn-guardar-estado" class="btn-primary">
                        Guardar actualizacion
                    </button>
                </div>
            </form>
        </div>
    `

    const btntoggle = seccion.querySelector('#btn-toggle-gestion')
    const contenedorForm = seccion.querySelector('#contenedor-form-gestion')
    const textoToggle = seccion.querySelector('#texto-toggle-gestion')
    const iconoTogle = seccion.querySelector('#icono-toggle-gestion')

    btntoggle.addEventListener('click', () => {
        const abierto = !contenedorForm.classList.contains('hidden')
        
        contenedorForm.classList.toggle('hidden', abierto)
        btntoggle.setAttribute('aria-expanded', String(!abierto))
        textoToggle.textContent = abierto ? 'Actualizar estado' : 'Cerrar'
        iconoTogle.textContent = abierto ? '▾' : '▴'

        if(!abierto){
            seccion.querySelector('#nuevo-estado')?.focus()
        }
    })

    seccion.querySelector('#form-actualizar-estado').addEventListener('submit', async(e) => {
        e.preventDefault()
        
        const btn = seccion.querySelector('#btn-guardar-estado')
        const msg = seccion.querySelector('#msg-gestion')
        const estadoNuevo = seccion.querySelector('#nuevo-estado').value
        const prioridadNueva = seccion.querySelector('#nueva-prioridad').value
        const comentario = seccion.querySelector('#comentario-seguimiento').value.trim()

        if(!comentario)
            return

        try {
            btn.disabled = true
            btn.textContent = 'Guardado...'

            const ahoraISO = new Date().toISOString()
            await actualizarIncidencia(incidencia.id, {
                estado: estadoNuevo,
                prioridad: prioridadNueva,
                responsableId: usuario.uid
            })

            const movimientoDoc = {
                estadoAnterior: incidencia.estado,
                estadoNuevo,
                comentario,
                responsableId: usuario.uid,
                responsable: usuario.nombre || usuario.email,
                fecha: serverTimestamp()
            }

            await addDoc(collection(db, 'incidencias', incidencia.id, 'historial_estados'), movimientoDoc)

            incidencia.estado = estadoNuevo
            incidencia.prioridad = prioridadNueva
            incidencia.responsableId = usuario.uid
            incidencia.historial = [...(incidencia.historial ?? []), {...movimientoDoc, fecha: ahoraISO}]

            await mostrarDetalle(incidencia, usuario)
        } catch (error) {
            console.error('Error al actualizar incidencia:', error)
            msg.className = 'text-xs font-semibold text-red-700'
            msg.textContent = 'No se pudo actualizar.'
            btn.disabled = false
            btn.textContent = 'Guardar actualizacion'
        }
    })

    return seccion
}

async function mostrarDetalle(incidencia, usuario) {
    const plantilla = await cargarVista('vistas/detalle-incidencia.html');
    const plantillaMovimiento = await cargarVista('vistas/movimiento-historial.html');
    const vista = plantilla.content.cloneNode(true);

    document.title = incidencia.folio + ' · ReportaCampus';
    asignarTexto(vista, '[data-folio]', incidencia.folio ?? '');
    asignarTexto(vista, '[data-titulo]', incidencia.titulo ?? '');
    asignarFecha(vista.querySelector('[data-fecha]'), incidencia.fechaCreacion, true);
    mostrarEstado(vista.querySelector('[data-estado]'), incidencia.estado);
    asignarIcono(vista.querySelector('[data-icono]'), incidencia.categoriaId);
    asignarTexto(vista, '[data-categoria]', nombreCategoria(incidencia.categoriaId));
    asignarTexto(vista, '[data-prioridad]', capitalizar(incidencia.prioridad));
    asignarTexto(vista, '[data-edificio]', nombreEdificio(incidencia.edificioId));
    asignarTexto(vista, '[data-aula]', incidencia.aula ?? '');
    asignarTexto(vista, '[data-descripcion]', incidencia.descripcion ?? '');

    const movimientos = [...(incidencia.historial ?? [])];
    movimientos.sort(function (anterior, siguiente) {
        return new Date(anterior.fecha) - new Date(siguiente.fecha);
    });

    const historial = vista.querySelector('[data-historial]');

    if (movimientos.length === 0) {
        const aviso = document.createElement('p');
        aviso.className = 'text-sm text-stone-500';
        aviso.textContent = 'Aún no hay movimientos registrados para esta incidencia.';
        historial.replaceWith(aviso);
    } else {
        movimientos.forEach(function (movimiento, indice) {
            const fila = crearMovimiento(movimiento, indice, movimientos.length, plantillaMovimiento);
            historial.append(fila);
        });
    }

    contenido.replaceChildren(vista);

    const puedeGestionar = usuario && (usuario.rol === 'responsable' || usuario.rol === 'admin')
    if(puedeGestionar && !incidencia.esDemo){
        contenido.append(panelGestion(incidencia, usuario))
    }
}

async function iniciarDetalle() {
    try {
        const usuario = await usuarioActual()
        if(!usuario){
            window.location.href = 'login.html'
            return
        }

        const parametros = new URLSearchParams(window.location.search);
        const id = parametros.get('id');
        const[incidencia, catalogos] = await Promise.all([
            id ? obtenerIncidencia(id) : null,
            obtenerMapaCatalogos()
        ])
        categoriasMap = catalogos.categoriasMap
        edificiosMap = catalogos.edificiosMap

        if (!incidencia) {
            const plantilla = await cargarVista('vistas/no-encontrado.html');
            document.title = 'Incidencia no encontrada · ReportaCampus';
            contenido.replaceChildren(plantilla.content.cloneNode(true));
            return;
        }

        await mostrarDetalle(incidencia, usuario);
    } catch (error) {
        console.error('No se pudo cargar el detalle:', error);
        contenido.textContent = 'No se pudo cargar el detalle. Intenta recargar la página.';
    }
}

iniciarDetalle();