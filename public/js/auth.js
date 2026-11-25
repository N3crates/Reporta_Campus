import { auth, db, doc, getDoc, setDoc, serverTimestamp } from './firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    deleteUser,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

export async function registrarUsuario(nombre, correo, password) {
    const credencial = await createUserWithEmailAndPassword(auth, correo.trim(), password);
    try {
        await setDoc(doc(db, 'usuarios', credencial.user.uid), {
            nombre: nombre.trim(),
            correo: credencial.user.email,
            rol: 'reportante',
            fechaRegistro: serverTimestamp()
        });
    } catch (error) {
        // Si el perfil no pudo guardarse, se revierte únicamente el alta recién creada.
        try {
            await deleteUser(credencial.user);
        } catch {
            const perfilIncompleto = new Error('No se pudo completar el perfil.');
            perfilIncompleto.code = 'perfil-incompleto';
            throw perfilIncompleto;
        }
        throw error;
    }
    return credencial.user;
}

export async function iniciarSesion(correo, password) {
    const credencial = await signInWithEmailAndPassword(auth, correo.trim(), password);
    return credencial.user;
}

export async function cerrarSesion() {
    await signOut(auth);
    window.location.href = 'login.html';
}

export function usuarioActual() {
    return new Promise(function (resolve, reject) {
        const cancelar = onAuthStateChanged(
            auth,
            async function (user) {
                cancelar();
                if (!user) {
                    resolve(null);
                    return;
                }
                try {
                    const perfil = await getDoc(doc(db, 'usuarios', user.uid));
                    if (!perfil.exists()) {
                        const error = new Error('No se encontró el perfil de la cuenta.');
                        error.code = 'perfil-incompleto';
                        throw error;
                    }
                    resolve({ ...perfil.data(), uid: user.uid, email: user.email });
                } catch (error) {
                    reject(error);
                }
            },
            reject
        );
    });
}

export async function protegerPagina(rolesPermitidos = []) {
    const usuario = await usuarioActual();
    if (!usuario) {
        window.location.href = 'login.html';
        return null;
    }
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) {
        const error = new Error('No tienes permiso para realizar esta acción.');
        error.code = 'permission-denied';
        throw error;
    }
    return usuario;
}

export async function redirigirSiAuntenticado() {
    const usuario = await usuarioActual();
    if (usuario) {
        window.location.href = 'index.html';
    }
}
