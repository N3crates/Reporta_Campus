import { iniciarSesion, registrarUsuario, redirigirSiAuntenticado } from '../auth.js';
import { mensajeError, mostrarMensaje } from '../mensajes.js';
import {
    validarAcceso,
    mostrarErroresFormulario,
    limpiarErroresFormulario
} from '../validaciones.js';

const formulario =
    document.getElementById('form-login') || document.getElementById('form-registro');
const registro = formulario.id === 'form-registro';
const alerta = document.getElementById('alert-error');
const boton = document.getElementById('btn-submit');
const etiqueta = registro ? 'Crear mi cuenta ↗' : 'Iniciar sesión ↗';

document.getElementById('mostrar-password').addEventListener('click', function (evento) {
    const campo = document.getElementById('password');
    const mostrar = campo.type === 'password';
    campo.type = mostrar ? 'text' : 'password';
    evento.currentTarget.textContent = mostrar ? 'Ocultar' : 'Mostrar';
    evento.currentTarget.setAttribute('aria-pressed', String(mostrar));
});

formulario.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    if (boton.disabled) {
        return;
    }
    limpiarErroresFormulario(formulario, alerta);
    const datos = {
        nombre: document.getElementById('nombre')?.value || '',
        correo: document.getElementById('correo').value,
        password: document.getElementById('password').value,
        confirmacion: document.getElementById('confirmar-password')?.value || ''
    };
    const errores = validarAcceso(datos, registro);
    if (errores.length > 0) {
        mostrarErroresFormulario(formulario, alerta, errores);
        return;
    }
    boton.disabled = true;
    formulario.setAttribute('aria-busy', 'true');
    boton.textContent = registro ? 'Creando tu cuenta…' : 'Iniciando sesión…';
    try {
        if (registro) {
            await registrarUsuario(datos.nombre, datos.correo, datos.password);
        } else {
            await iniciarSesion(datos.correo, datos.password);
        }
        window.location.href = 'incidencias.html';
    } catch (error) {
        mostrarMensaje(alerta, mensajeError(error));
    } finally {
        boton.disabled = false;
        boton.textContent = etiqueta;
        formulario.removeAttribute('aria-busy');
    }
});

redirigirSiAuntenticado().catch(function (error) {
    mostrarMensaje(alerta, mensajeError(error));
});
