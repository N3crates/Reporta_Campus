import { auth, db, doc, getDoc, setDoc, serverTimestamp } from './firebase.js'
import { 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        signOut, 
        onAuthStateChanged 
        } from 'http://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'

// Registrar usuario con rol reportante
export async function registrarUsuario(nombre, correo, password) {
    const credencial = await createUserWithEmailAndPassword(auth, correo, password)
    const uid = credencial.user.uid

    await setDoc(doc(db, 'usuarios', uid), {
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        rol: 'reportante',
        fechaRegistro: serverTimestamp()
    })

    return credencial.user
}

// Inicia sesion
export async function iniciarSesion(correo, password){
    const credencial = await signInWithEmailAndPassword(auth, correo, password)
    console.log('correo:', correo)
    console.log('pass:', password)
    return credencial.user 
}

// Cerrar session
export async function cerrarSesion(){
    await signOut(auth)
    window.location.href = 'login.html'
}

// Obtiene el usuario autenticado
export function usuarioActual(){
    return new Promise((resolve) => {
        const usuario = onAuthStateChanged(auth, async(user) => {
            usuario()
            if(!user){
                resolve(null)
                return
            }

            try {
                const snap = await getDoc(doc(db, 'usuarios', user.uid))
                
                if(snap.exists()){
                    resolve({
                        uid: user.uid,
                        email: user.email,
                        ...snap.data()
                    })
                }else{
                    resolve({uid: user.uid, email: user.email, rol: 'reportante'})
                }
            } catch (error) {
                console.error('Error al leer perfil de usuario:', error)
                resolve(null)
            }
        })
    })
}

// Pide sesion activa y roles permitidos
export async function protegerPagina(rolesPermitidos = []){
    const usuario = await usuarioActual();

    if(!usuario){
        window.location.href = 'login.html'
        return null
    }
    if(rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)){
        alert('No tiene permisos para acceder a esta seccion.')
        window.location.href = 'index.html'
        return null
    }

    return usuario
}

// Si hay session iniciada redirige al inicio
export async function redirigirSiAuntenticado(){
    const usuario = await usuarioActual()
    
    if(usuario){
        window.location.href = 'index.html'
    }
}