export function mensajeError(error) {
    const codigo = String(error?.code || '').replace('firestore/', '');
    const mensajes = {
        'permission-denied':
            'No tienes permiso para esta acción. Comprueba tu sesión o consulta al responsable.',
        unauthenticated: 'Tu sesión terminó. Inicia sesión de nuevo.',
        unavailable: 'No hay conexión con el servicio. Conservamos tus datos; intenta de nuevo.',
        'auth/network-request-failed':
            'No se pudo conectar. Revisa tu conexión e intenta de nuevo.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
        'auth/user-not-found': 'Correo o contraseña incorrectos.',
        'auth/wrong-password': 'Correo o contraseña incorrectos.',
        'auth/email-already-in-use': 'Este correo ya tiene una cuenta. Intenta iniciar sesión.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-email': 'Escribe un correo electrónico válido.',
        'auth/too-many-requests':
            'Hubo demasiados intentos. Espera un momento antes de volver a intentar.',
        'auth/user-disabled': 'La cuenta está deshabilitada. Consulta al responsable.',
        'failed-precondition':
            'La consulta requiere configurar un índice en Firestore. Informa al responsable.',
        'perfil-incompleto':
            'La cuenta existe, pero su perfil no está disponible. Consulta al responsable antes de registrarte otra vez.',
        'not-found': 'La incidencia ya no está disponible.',
        conflict: 'El reporte cambió mientras lo editabas. Recarga para revisar la versión actual.',
        validacion: error?.message
    };
    return (
        mensajes[codigo] ||
        'No se pudo completar la operación. Conservamos tus datos; vuelve a intentarlo.'
    );
}

export function mostrarMensaje(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove('hidden');
    elemento.focus();
}

export function crearError(codigo, mensaje) {
    const error = new Error(mensaje);
    error.code = codigo;
    return error;
}
