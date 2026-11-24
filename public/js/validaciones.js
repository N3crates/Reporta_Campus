export function validarIncidencia(datos) {
    const errores = [];
    const campos = [
        ['titulo', 'El título', 100],
        ['descripcion', 'La descripción', 500],
        ['aula', 'El aula o espacio', 100],
        ['categoriaId', 'La categoría', 100],
        ['edificioId', 'El edificio', 100]
    ];
    for (const [campo, nombre, limite] of campos) {
        const valor = String(datos[campo] || '').trim();
        if (!valor) {
            errores.push({ campo, mensaje: nombre + ' es obligatorio.' });
        } else if (valor.length > limite) {
            errores.push({ campo, mensaje: nombre + ' admite hasta ' + limite + ' caracteres.' });
        }
    }
    if (!['baja', 'media', 'alta'].includes(datos.prioridad)) {
        errores.push({ campo: 'prioridad', mensaje: 'Selecciona una prioridad válida.' });
    }
    return errores;
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
        const fila = document.createElement('li');
        fila.textContent = error.mensaje;
        lista.append(fila);
        const campo = formulario.querySelector('#' + error.campo);
        campo?.setAttribute('aria-invalid', 'true');
        campo?.setAttribute('aria-errormessage', alerta.id);
    }
    alerta.replaceChildren(lista);
    alerta.classList.remove('hidden');
    formulario.querySelector('#' + errores[0].campo)?.focus();
}

export function limpiarErroresFormulario(formulario, alerta) {
    alerta.classList.add('hidden');
    for (const campo of formulario.querySelectorAll('[aria-invalid]')) {
        campo.removeAttribute('aria-invalid');
        campo.removeAttribute('aria-errormessage');
    }
}
