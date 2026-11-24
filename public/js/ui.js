import { cargarVista } from './funciones.js';

// Vistas compartidas: equivalente al encabezado y pie separados en la clase.
async function cargarPartesComunes() {
    const encabezado = await cargarVista('vistas/encabezado.html');
    const pie = await cargarVista('vistas/pie.html');

    document.getElementById('encabezado').replaceChildren(encabezado.content.cloneNode(true));
    document.getElementById('pie-pagina').replaceChildren(pie.content.cloneNode(true));
}

function marcarPaginaActual() {
    const segmentos = window.location.pathname.split('/');
    const pagina = segmentos.pop() || 'index.html';
    const enlaces = document.querySelectorAll('#navegacion a');

    for (const enlace of enlaces) {
        if (enlace.getAttribute('href') === pagina) {
            enlace.setAttribute('aria-current', 'page');
        }
    }
}

function prepararMenu() {
    const boton = document.getElementById('menu-toggle');
    const navegacion = document.getElementById('navegacion');
    const escritorio = window.matchMedia('(min-width: 768px)');

    function cambiarMenu(abierto) {
        boton.setAttribute('aria-expanded', String(abierto));
        navegacion.classList.toggle('hidden', !abierto);
        navegacion.classList.toggle('flex', abierto);
    }

    boton.addEventListener('click', function () {
        const abierto = boton.getAttribute('aria-expanded') === 'true';
        cambiarMenu(!abierto);
    });

    document.addEventListener('keydown', function (evento) {
        const abierto = boton.getAttribute('aria-expanded') === 'true';

        if (evento.key === 'Escape' && abierto) {
            cambiarMenu(false);
            boton.focus();
        }
    });

    navegacion.addEventListener('click', function (evento) {
        if (evento.target.closest('a') && !escritorio.matches) {
            cambiarMenu(false);
        }
    });

    escritorio.addEventListener('change', function () {
        cambiarMenu(false);
    });
}

async function iniciarInterfaz() {
    try {
        await cargarPartesComunes();
        marcarPaginaActual();
        prepararMenu();
    } catch (error) {
        console.error('No se pudo preparar la navegación:', error);
        const aviso = document.createElement('p');
        aviso.className = 'p-4 text-sm text-red-800';
        aviso.textContent = 'No se pudo cargar el menú. Recarga la página desde el servidor local.';
        document.getElementById('encabezado').replaceChildren(aviso);
    }
}

iniciarInterfaz();
