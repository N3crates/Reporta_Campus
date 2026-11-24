import { cargarVista } from './funciones.js';
import { usuarioActual, cerrarSesion } from './auth.js'

const BADGES_ROL = {
    reportante: 'bg-white/15 text-slate-100 border-white/25',
    responsable: 'bg-amber-400/20 text-[#ffd300] border-[#ffd300]/40',
    admin: 'bg-[#ffd300] text-slate-900 border-[#ffd300]'
}

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

async function prepararSesionUsuario(){
    const navUsuario = document.getElementById('nav-usuario')
    const linkAdmin = document.getElementById('nav-link-admin')
    const navegacion = document.getElementById('navegacion')
    const user = await usuarioActual()
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html'
    const paginasPublicas = ['index.html', 'index', 'login.html', 'login', 'registro.html', 'registro']
    const esPaginaPublica = paginasPublicas.includes(paginaActual)

    if(!user && !esPaginaPublica){
        window.location.href = 'login.html'
        return
    }
    if(!navUsuario) 
        return

    if(!user){
        navUsuario.innerHTML = `
            <a href="login.html" class="text-xs font-semibold text-white hover:text-[#ffd300] transition">
                Iniciar sesion
            </a>
            <a href="registro.html" class="text-sm font-bold bg-[#ffd300] text-slate-900 px-3 py-1.5 rounded hover:brightness-95 transition">
                Registrar
            </a>
        `
        return
    }

    if(user.rol === 'admin' && linkAdmin){
        linkAdmin.classList.remove('hidden')
    }
    
    const badgeClase = BADGES_ROL[user.rol] || BADGES_ROL.reportante
    navUsuario.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-white truncate max-w-[160px]">
                ${ user.nombre || user.email }
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${ badgeClase }">
                ${ user.rol }
            </span>
        </div>
        <button 
            id="btn-cerrar-sesion"
            type="button"
            class="text-xs font-semibold text-red-200 hover:text-white hover:bg-red-600/80 px-2.5 py-1 rounded border border-red-300/30 transition cursor-pointer"
            >
            Salir
        </button>
    `
    document.getElementById('btn-cerrar-sesion') ?.addEventListener('click', () => cerrarSesion())

}

async function iniciarInterfaz() {
    try {
        await cargarPartesComunes();
        marcarPaginaActual();
        prepararMenu();
        await prepararSesionUsuario()
    } catch (error) {
        console.error('No se pudo preparar la navegación:', error);
        const aviso = document.createElement('p');
        aviso.className = 'p-4 text-sm text-red-800';
        aviso.textContent = 'No se pudo cargar el menú. Recarga la página desde el servidor local.';
        document.getElementById('encabezado').replaceChildren(aviso);
    }
}

iniciarInterfaz();
