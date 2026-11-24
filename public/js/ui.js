import { cargarVista } from './funciones.js';
import { usuarioActual, cerrarSesion } from './auth.js';
import { mensajeError } from './mensajes.js';

async function cargarPartesComunes() {
    const [encabezado, pie] = await Promise.all([
        cargarVista('vistas/encabezado.html'),
        cargarVista('vistas/pie.html')
    ]);
    document.getElementById('encabezado').replaceChildren(encabezado.content.cloneNode(true));
    document.getElementById('pie-pagina').replaceChildren(pie.content.cloneNode(true));
}

function prepararMenu() {
    const boton = document.getElementById('menu-toggle');
    const navegacion = document.getElementById('navegacion');
    function cambiarMenu(abierto) {
        boton.setAttribute('aria-expanded', String(abierto));
        navegacion.classList.toggle('hidden', !abierto);
        navegacion.classList.toggle('flex', abierto);
    }
    boton.addEventListener('click', function () {
        cambiarMenu(boton.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') {
            cambiarMenu(false);
            boton.focus();
        }
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', function () {
        cambiarMenu(false);
    });
    const pagina = window.location.pathname.split('/').pop() || 'index.html';
    for (const enlace of navegacion.querySelectorAll('a')) {
        if (enlace.getAttribute('href') === pagina) {
            enlace.setAttribute('aria-current', 'page');
        }
    }
}

async function prepararSesion() {
    const contenedor = document.getElementById('nav-usuario');
    const vista = await cargarVista('vistas/sesion.html');
    contenedor.replaceChildren(vista.content.cloneNode(true));
    try {
        const usuario = await usuarioActual();
        if (!usuario) {
            return;
        }
        contenedor.querySelector('[data-sesion-publica]').hidden = true;
        contenedor.querySelector('[data-sesion-privada]').hidden = false;
        contenedor.querySelector('[data-usuario]').textContent = usuario.nombre || usuario.email;
        const roles = {
            reportante: 'Reportante',
            responsable: 'Responsable',
            admin: 'Administrador'
        };
        contenedor.querySelector('[data-rol]').textContent = roles[usuario.rol] || 'Sin rol';
        document
            .getElementById('nav-link-admin')
            .classList.toggle('hidden', usuario.rol !== 'admin');
        contenedor
            .querySelector('#btn-cerrar-sesion')
            .addEventListener('click', async function (evento) {
                const boton = evento.currentTarget;
                boton.disabled = true;
                try {
                    await cerrarSesion();
                } catch (error) {
                    boton.disabled = false;
                    const alerta = contenedor.querySelector('[data-error-sesion]');
                    alerta.hidden = false;
                    alerta.textContent = mensajeError(error);
                }
            });
    } catch (error) {
        const alerta = contenedor.querySelector('[data-error-sesion]');
        alerta.hidden = false;
        alerta.textContent = mensajeError(error);
    }
}

async function iniciarInterfaz() {
    try {
        await cargarPartesComunes();
        prepararMenu();
        await prepararSesion();
    } catch (error) {
        const aviso = document.createElement('p');
        aviso.className = 'form-alert form-alert-error';
        aviso.textContent = 'No se pudo cargar la navegación. Recarga la página.';
        document.getElementById('encabezado').replaceChildren(aviso);
    }
}

iniciarInterfaz();
