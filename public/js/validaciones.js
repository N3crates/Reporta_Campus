export function validarIncidencia(datos) {
    const errores = [];
    const campos = [
        ['titulo', 'El título', 3, 100],
        ['descripcion', 'La descripción', 10, 500],
        ['aula', 'El aula o espacio', 1, 100],
        ['categoriaId', 'La categoría', 1, 100],
        ['edificioId', 'El edificio', 1, 100]
    ];
    for (const [campo, nombre, minimo, limite] of campos) {
        const valor = String(datos[campo] || '').trim();
        if (!valor) {
            errores.push({ campo, mensaje: nombre + ' es obligatorio.' });
        } else if (valor.length < minimo) {
            errores.push({ campo, mensaje: nombre + ' debe tener al menos ' + minimo + ' caracteres.' });
        } else if (valor.length > limite) {
            errores.push({ campo, mensaje: nombre + ' admite hasta ' + limite + ' caracteres.' });
        }
    }
    if (!['baja', 'media', 'alta'].includes(datos.prioridad)) {
        errores.push({ campo: 'prioridad', mensaje: 'Selecciona una prioridad válida.' });
    }
    return errores;
}

export async function validarCatalogos(datos) {
    const { db, doc, getDoc } = await import('./firebase.js');
    const catalogos = [
        ['categoriaId', 'categorias', 'La categoría'],
        ['edificioId', 'edificios', 'El edificio']
    ];
    const errores = await Promise.all(catalogos.map(async function ([campo, coleccion, nombre]) {
        const registro = await getDoc(doc(db, coleccion, datos[campo]));
        if (!registro.exists()) {
            return { campo, mensaje: nombre + ' ya no existe. Selecciona otra opción.' };
        }
        return null;
    }));
    return errores.filter(Boolean);
}

export function validarAcceso(datos, registro) {
    const errores = [];
    if (registro && (!datos.nombre.trim() || datos.nombre.trim().length > 100)) {
        errores.push({ campo: 'nombre', mensaje: 'Escribe tu nombre, de hasta 100 caracteres.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim()) || datos.correo.length > 254) {
        errores.push({ campo: 'correo', mensaje: 'Escribe un correo electrónico válido.' });
    }
    if (!datos.password || (registro && datos.password.length < 6)) {
        errores.push({
            campo: 'password',
            mensaje: registro
                ? 'Usa una contraseña de al menos 6 caracteres.'
                : 'Escribe tu contraseña.'
        });
    }
    if (registro && datos.password !== datos.confirmacion) {
        errores.push({ campo: 'confirmar-password', mensaje: 'Las contraseñas no coinciden.' });
    }
    return errores;
}

export function mostrarErroresFormulario(formulario, alerta, errores) {
    limpiarErroresFormulario(formulario, alerta);
    const lista = document.createElement('ul');
    lista.className = 'list-disc pl-5 space-y-1';
    for (const error of errores) {
        const campo = formulario.elements.namedItem(error.campo) ||
            formulario.querySelector('#' + error.campo);
        if (campo) {
            const aviso = document.createElement('p');
            aviso.id = campo.id + '-error';
            aviso.className = 'mt-2 text-xs font-semibold text-red-800';
            aviso.dataset.errorCampo = '';
            aviso.textContent = error.mensaje;
            campo.insertAdjacentElement('afterend', aviso);
            campo.setAttribute('aria-invalid', 'true');
            campo.setAttribute('aria-errormessage', aviso.id);
        } else {
            const fila = document.createElement('li');
            fila.textContent = error.mensaje;
            lista.append(fila);
        }
    }
    if (lista.childElementCount > 0) {
        alerta.replaceChildren(lista);
    } else {
        alerta.textContent = 'Revisa los campos marcados.';
    }
    alerta.classList.remove('hidden');
    formulario.querySelector('[aria-invalid]')?.focus();
}

export function limpiarErroresFormulario(formulario, alerta) {
    alerta.classList.add('hidden');
    for (const aviso of formulario.querySelectorAll('[data-error-campo]')) {
        aviso.remove();
    }
    for (const campo of formulario.querySelectorAll('[aria-invalid]')) {
        campo.removeAttribute('aria-invalid');
        campo.removeAttribute('aria-errormessage');
    }
}
