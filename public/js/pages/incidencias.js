import { obtenerMapaCatalogos } from '../catalogos.js';
import { obtenerIncidencias } from '../incidencias.js';
import { cargarVista, asignarTexto, mostrarEstado, asignarFecha, asignarIcono, normalizarTexto } from '../funciones.js';
import { usuarioActual } from '../auth.js';

usuarioActual().then((usuario) => {
    if(!usuario){
        window.location.href = 'login.html'
    }
})

const formulario = document.getElementById('filtros');
const lista = document.getElementById('lista-incidencias');

let plantilla;
let incidenciasConsultadas = []
let categoriasMap = {}
let edificiosMap = {}

const nombreCategoria = id => categoriasMap[id] ?? id ?? 'Sin categoría';
const nombreEdificio = id => edificiosMap[id] ?? id ?? 'Sin edificio';

function leerFiltros() {
    return {
        busqueda: normalizarTexto(document.getElementById('buscar').value),
        estado: document.getElementById('estado').value,
        prioridad: document.getElementById('prioridad').value,
        categoriaId: document.getElementById('categoria').value,
        edificioId: document.getElementById('edificio').value
    };
}

function poblarFiltro(categorias, edificios) {
    const selectCategoria = document.getElementById('categoria')
    const selectEdificio = document.getElementById('edificio')

    selectCategoria.replaceChildren(new Option('Todas las categorias', ''))
    for(const cat of categorias){
        selectCategoria.append(new Option(cat.nombre, cat.id))
    }

    selectEdificio.replaceChildren(new Option('Todos los edificios', ''))
    for(const edif of edificios){
        selectEdificio.append(new Option(edif.nombre, edif.id))
    }
}

function crearTarjeta(incidencia) {
    const vista = plantilla.content.cloneNode(true);
    const enlace = 'detalle?id=' + encodeURIComponent(incidencia.id);

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

    const detalle = vista.querySelector('[data-detalle]');
    detalle.href = enlace;
    detalle.setAttribute('aria-label', 'Ver detalle: ' + incidencia.titulo);

    return vista;
}

function renderizarTarjetas(){
    const { busqueda } = leerFiltros()
    const filtradasPorTexto = incidenciasConsultadas.filter((incidencia) => {
        if(!busqueda)
            return true

        const texto = normalizarTexto((incidencia.titulo ?? '') + ' ' + (incidencia.folio ?? ''))
        return texto.includes(busqueda)
    })

    const cantidad = filtradasPorTexto.length
    document.getElementById('resultados-conteo').textContent = cantidad === 1 ? '1 incidencia encontrada' : `${cantidad} incidencias encontradas`
    document.getElementById('estado-vacio').classList.toggle('hidden', cantidad !== 0)
    lista.replaceChildren()

    for(const incidencia of filtradasPorTexto){
        lista.append(crearTarjeta(incidencia))
    }
}

async function mostrarIncidencias() {
    
    try {
        document.getElementById('resultados-conteo').textContent = 'Consultando incidencias...'
        const { estado, prioridad, categoriaId, edificioId} = leerFiltros()

        incidenciasConsultadas = await obtenerIncidencias({
            estado, prioridad, categoriaId, edificioId
        })

        renderizarTarjetas()
    } catch (error) {
        console.error('Error al consultar incidencias filtradas:', error)
        document.getElementById('resultados-conteo').textContent = 'Error al consultar las incidencias. Revisa los indices en consola.'
    }
}

function limpiarFiltros() {
    formulario.reset();
    mostrarIncidencias();
}

async function iniciarListado() {
    try {
        const usuario = await usuarioActual()
        if(!usuario){
            window.location.href = 'login.html'
        }

        document.getElementById('resultados-conteo').textContent = 'Cargando incidencias…';
        const [plantillaCargada, catalogos] = await Promise.all([
            cargarVista('vistas/tarjeta-incidencia.html'),
            obtenerMapaCatalogos()
        ])

        plantilla = plantillaCargada
        categoriasMap = catalogos.categoriasMap
        edificiosMap = catalogos.edificiosMap
        poblarFiltro(catalogos.categorias, catalogos.edificios)

        document.getElementById('buscar').addEventListener('input', renderizarTarjetas)
        formulario.addEventListener('change', (e) => {
            if(e.target.id !== 'buscar'){
                mostrarIncidencias()
            }
        })

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault()
            mostrarIncidencias()
        })

        document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros);
        document.getElementById('limpiar-vacio').addEventListener('click', limpiarFiltros);
        
        await mostrarIncidencias();
    } catch (error) {
        console.error('No se pudo cargar el listado:', error);
        document.getElementById('resultados-conteo').textContent =
            'No se pudo cargar el listado. Intenta recargar la página.';
    }
}

iniciarListado();