import { cargarVista } from '../funciones.js';
let plantillaFila;
import { db } from '../firebase.js';
import { usuarioActual } from '../auth.js';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const ESTILOS_ROL = {
    reportante: 'role-badge role-badge--reportante',
    responsable: 'role-badge role-badge--responsable',
    admin: 'role-badge role-badge--admin'
};

const ETIQUETAS_ROL = {
    reportante: 'Reportante',
    responsable: 'Responsable',
    admin: 'Administrador'
};

let uidAdminActual = null;
let usuariosCache = [];

function mostrarAlerta(mensaje, esError = false) {
    const alerta = document.getElementById('alerta-admin');

    if (!alerta) {
        return;
    }

    alerta.textContent = mensaje;
    alerta.className = `
        admin-alert ${esError ? 'admin-alert--error' : 'admin-alert--success'}
    `;

    alerta.classList.remove('hidden');
    setTimeout(() => alerta.classList.add('hidden'), 3500);
}

function abrirModalEdicion(usuario) {
    document.getElementById('edit-uid').value = usuario.uid;
    document.getElementById('edit-correo').value = usuario.correo || '';
    document.getElementById('edit-nombre').value = usuario.nombre || '';
    document.getElementById('edit-rol').value = usuario.rol || 'reportante';

    const selectRol = document.getElementById('edit-rol');
    selectRol.disabled = usuario.uid === uidAdminActual;

    document.getElementById('modal-editar-usuario').classList.remove('hidden');
}

function cerrarModalEdicion() {
    document.getElementById('modal-editar-usuario').classList.add('hidden');
    document.getElementById('form-editar-usuario').reset();
}

function renderizarTabla() {
    const tbody = document.getElementById('tabla-usuarios');
    document.getElementById('contador-usuarios').textContent = usuariosCache.length + ' usuarios';
    tbody.replaceChildren();
    if (usuariosCache.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 4;
        celda.textContent = 'No hay usuarios registrados.';
        fila.append(celda);
        tbody.append(fila);
        return;
    }
    for (const usuario of usuariosCache) {
        const vista = plantillaFila.content.cloneNode(true);
        vista.querySelector('[data-nombre]').textContent = usuario.nombre || 'Sin nombre';
        vista.querySelector('[data-correo]').textContent = usuario.correo || '';
        vista.querySelector('[data-propio]').hidden = usuario.uid !== uidAdminActual;
        const rol = vista.querySelector('[data-rol]');
        rol.className = ESTILOS_ROL[usuario.rol] || ESTILOS_ROL.reportante;
        rol.textContent = ETIQUETAS_ROL[usuario.rol] || 'Sin rol';
        for (const boton of vista.querySelectorAll('[data-accion]')) {
            boton.dataset.uid = usuario.uid;
        }
        vista.querySelector('[data-accion="eliminar"]').disabled = usuario.uid === uidAdminActual;
        tbody.append(vista);
    }
}

async function cargarUsuarios() {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    usuariosCache = snapshot.docs.map((documento) => ({
        uid: documento.id,
        ...documento.data()
    }));
    renderizarTabla();
}

function configurarEventos() {
    const tbody = document.getElementById('tabla-usuarios');
    const modal = document.getElementById('modal-editar-usuario');
    const formEditar = document.getElementById('form-editar-usuario');

    tbody?.addEventListener('click', async (e) => {
        const boton = e.target.closest('button[data-accion]');

        if (!boton) {
            return;
        }

        const uid = boton.dataset.uid;
        const accion = boton.dataset.accion;
        const usuario = usuariosCache.find((u) => u.uid === uid);

        if (!usuario) {
            return;
        }
        if (accion === 'editar') {
            abrirModalEdicion(usuario);
        }
        if (accion === 'eliminar') {
            if (uid === uidAdminActual) {
                return;
            }

            const confirmado = window.confirm(
                `¿Retirar el perfil de "${usuario.nombre || usuario.correo}"? `
            );
            if (!confirmado) {
                return;
            }

            try {
                await deleteDoc(doc(db, 'usuarios', uid));
                usuariosCache = usuariosCache.filter((u) => u.uid !== uid);
                renderizarTabla();
                mostrarAlerta(
                    'Perfil retirado. Esta acción no elimina la cuenta de Firebase Authentication.'
                );
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                mostrarAlerta('No se pudo eliminar el usuario.', true);
            }
        }
    });

    formEditar?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const uid = document.getElementById('edit-uid').value;
        const nuevoNombre = document.getElementById('edit-nombre').value.trim();
        const nuevoRol = document.getElementById('edit-rol').value;

        if (!nuevoNombre) {
            return;
        }

        try {
            await updateDoc(doc(db, 'usuarios', uid), {
                nombre: nuevoNombre,
                rol: nuevoRol
            });

            const index = usuariosCache.findIndex((u) => u.uid === uid);
            if (index !== -1) {
                usuariosCache[index].nombre = nuevoNombre;
                usuariosCache[index].rol = nuevoRol;
            }

            renderizarTabla();
            cerrarModalEdicion();
            mostrarAlerta('Perfil de usuario actualizado.');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            mostrarAlerta('No se pudieron guardar los cambios.', true);
        }
    });

    document.getElementById('btn-cerrar-modal')?.addEventListener('click', cerrarModalEdicion);
    document.getElementById('btn-cancelar-modal')?.addEventListener('click', cerrarModalEdicion);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModalEdicion();
        }
    });
}

async function iniciarAdmin() {
    const usuario = await usuarioActual();

    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    if (usuario.rol !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    uidAdminActual = usuario.uid;
    document.getElementById('contenido-admin')?.classList.remove('hidden');
    configurarEventos();

    try {
        plantillaFila = await cargarVista('vistas/fila-usuario.html');
        await cargarUsuarios(usuario.uid);
    } catch (error) {
        console.error('Error cargado panel:', error);
        mostrarAlerta('Error al cargar los datos.', true);
    }
}

iniciarAdmin();
