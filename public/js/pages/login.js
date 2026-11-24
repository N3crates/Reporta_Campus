import { iniciarSesion, registrarUsuario, redirigirSiAuntenticado } from "../auth.js";

// Si el usuario ya inicio sesion se manda a inicio
redirigirSiAuntenticado()

const formLogin = document.getElementById('form-login')
const formRegistro = document.getElementById('form-registro')
const alertError = document.getElementById('alert-error')
const btnSubmit = document.getElementById('btn-submit')

function mostrarError(codigo){
    const mensajes = {
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
        'auth/user-not-fund': 'No existe una cuenta con este correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/email-already-in-use': 'Este correo ya esta registrado',
        'auth/weak-password': 'La contraseña debe de tener al menos 6 caracteres',
        'auth/invalid-email': 'El formato del correo electronico no es valido'
    }

    alertError.textContent = mensajes[codigo] || 'Ocurrio un error al procesar la solicitud.'
    alertError.classList.remove('hidden')
}

if(formLogin){
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault()
        alertError.classList.add('hidden')
        btnSubmit.disabled = true
        btnSubmit.textContent = 'Ingresando...'

        const correo = document.getElementById('correo').value
        const password = document.getElementById('password').value

        try {
            await iniciarSesion(correo, password)
            window.location.href = 'index.html'
        } catch (error) {
            mostrarError(error.code)
            btnSubmit.disabled = false
            btnSubmit.textContent = 'Ingresar'
        }
    })
}

if(formRegistro){
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault()
        alertError.classList.add('hidden')
        btnSubmit.disabled = true
        btnSubmit.textContent = 'Creando cuenta...'

        const nombre = document.getElementById('nombre').value
        const correo = document.getElementById('correo').value
        const password = document.getElementById('password').value

        try {
            await registrarUsuario(nombre, correo, password)
            window.location.href = 'index.html'
        } catch (error) {
            mostrarError(error.code)
            btnSubmit.disabled = false
            btnSubmit.textContent = 'Registrate'
        }
    })
}