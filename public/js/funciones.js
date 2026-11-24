// Funciones de presentación compartidas. No consultan Firebase.
export const estados = {
    reportado: {
        label: 'Reportado',
        css: 'badge-reported'
    },
    en_proceso: {
        label: 'En proceso',
        css: 'badge-progress'
    },
    resuelto: {
        label: 'Resuelto',
        css: 'badge-resolved'
    }
};

export async function cargarVista(ruta) {
    const respuesta = await fetch(ruta);

    if (!respuesta.ok) {
        throw new Error('No se pudo cargar la vista: ' + ruta);
    }

    const plantilla = document.createElement('template');
    // Solo se carga HTML estático del propio proyecto, nunca texto del usuario.
    plantilla.innerHTML = await respuesta.text();
    return plantilla;
}

export function asignarTexto(vista, selector, valor) {
    const elemento = vista.querySelector(selector);
    elemento.textContent = String(valor ?? '');
    return elemento;
}

export function mostrarEstado(elemento, estado) {
    const informacion = estados[estado];

    if (!informacion) {
        elemento.className = 'badge';
        elemento.textContent = 'Desconocido';
        return;
    }

    elemento.className = 'badge ' + informacion.css;
    elemento.textContent = informacion.label;
}

export function formatDate(valor, incluirHora = false) {
    const opciones = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'America/Mexico_City'
    };

    if (incluirHora) {
        opciones.hour = '2-digit';
        opciones.minute = '2-digit';
    }

    const formato = new Intl.DateTimeFormat('es-MX', opciones);
    return formato.format(new Date(valor));
}

export function asignarFecha(elemento, valor, incluirHora = false) {
    if (!valor || !Number.isFinite(new Date(valor).getTime())) {
        elemento.textContent = 'Fecha no disponible';
        elemento.removeAttribute('datetime');
        return;
    }
    elemento.dateTime = valor;
    elemento.textContent = formatDate(valor, incluirHora);
}

export function asignarIcono(elemento, categoria) {
    const categorias = ['iluminacion', 'computo', 'limpieza', 'mantenimiento', 'mobiliario'];
    let nombre = 'mantenimiento';

    if (categorias.includes(categoria)) {
        nombre = categoria;
    }

    elemento.setAttribute('href', 'assets/iconos.svg#' + nombre);
}

export function normalizarTexto(valor) {
    return String(valor)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}
