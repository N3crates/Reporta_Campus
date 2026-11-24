import { db } from '../firebase.js'
import { usuarioActual } from '../auth.js'
import { 
    collection, 
    getDocs, 
    doc, 
    updateDoc,
    deleteDoc
    } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const ESTILOS_ROL = {
    reportante: 'role-badge role-badge--reportante',
    responsable: 'role-badge role-badge--responsable',
    admin: 'role-badge role-badge--admin'
}

const ETIQUETAS_ROL = {
    reportante: 'Reportante',
    responsable: 'Responsable',
    admin: 'Administrador'
}

let uidAdminActual = null
let usuariosCache = []

function mostrarAlerta(mensaje, esError = false){
    const alerta = document.getElementById('alerta-admin')
    
    if (!alerta)
        return

    alerta.textContent = mensaje
    alerta.className = `
        admin-alert ${ esError ? 'admin-alert--error' : 'admin-alert--success'}
    `
    
    alerta.classList.remove('hidden')
    setTimeout(() => alerta.classList.add('hidden'), 3500)
}

function abrirModalEdicion(usuario){
    document.getElementById('edit-uid').value = usuario.uid
    document.getElementById('edit-correo').value = usuario.correo || ''
    document.getElementById('edit-nombre').value = usuario.nombre || ''
    document.getElementById('edit-rol').value = usuario.rol || 'reportante'

    const selectRol = document.getElementById('edit-rol')
    selectRol.disabled = usuario.uid === uidAdminActual

    document.getElementById('modal-editar-usuario').classList.remove('hidden')
}

function cerrarModalEdicion(){
    document.getElementById('modal-editar-usuario').classList.add('hidden')
    document.getElementById('form-editar-usuario').reset()
}

function renderizarTabla(){
    const tbody = document.getElementById('tabla-usuarios')
    const contador = document.getElementById('contador-usuarios')

    if(!tbody)
        return
    if(contador){
        contador.textContent = `${usuariosCache.length} usuarios`
    }
    if(usuariosCache.length === 0){
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="py-6 text-center text-slate-500">
                    No hay usuarios registrados
                </td>
            </tr>
        `
        return
    }

    tbody.innerHTML = ''
    usuariosCache.forEach((usuario) => {
        const rol = usuario.rol || 'reportante' 
        const esMismoAdmin = usuario.uid === uidAdminActual
        const claseBadge = ESTILOS_ROL[rol] || ESTILOS_ROL.reportante
        const etiquetaRol = ETIQUETAS_ROL[rol] || rol
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
            <td class="font-semibold text-[#0a263d]">
                ${ usuario.nombre || 'Sin nombre' }
                ${ esMismoAdmin ? '<span class="self-tag">Tu</span>' : ''}
            </td>
            <td class="text-slate-600">
                ${ usuario.correo || ''}
            </td>
            <td>
                <span class="${ claseBadge }">
                    ${ etiquetaRol }
                </span>
            </td>
            <td class="text-right space-x-2">
                <button 
                    type="button" 
                    data-accion="editar" 
                    data-uid="${ usuario.uid }" 
                    class="btn-table-edit"
                    >
                        Editar
                </button>
                <button 
                    type="button" 
                    data-accion="eliminar" 
                    data-uid="${ usuario.uid }" 
                    ${ esMismoAdmin ? 'disabled title="No se puede eliminar tu propio usuario"' : ''} 
                    class="btn-table-delete"
                    >
                        Eliminar
                </button>
            </td>

        `
        tbody.appendChild(tr)
    })
}

async function cargarUsuarios(){
    const snapshot = await getDocs(collection(db, 'usuarios'))
    usuariosCache = snapshot.docs.map((documento) => ({
        uid: documento.id,
        ...documento.data()
    }))
    renderizarTabla()
}

function configurarEventos(){
    const tbody = document.getElementById('tabla-usuarios')
    const modal = document.getElementById('modal-editar-usuario')
    const formEditar = document.getElementById('form-editar-usuario')

    tbody?.addEventListener('click', async(e) => {
        const boton = e.target.closest('button[data-accion]')

        if(!boton)
            return

        const uid = boton.dataset.uid
        const accion = boton.dataset.accion
        const usuario = usuariosCache.find((u) => u.uid === uid)

        if(!usuario)
            return
        if(accion === 'editar'){
            abrirModalEdicion(usuario)
        }
        if(accion === 'eliminar'){
            if(uid === uidAdminActual)
                return

            const confirmado = window.confirm(`¿Seguro que deseas eliminar al usuario "${ usuario.nombre || usuario.correo }"? `)
            if (!confirmado)
                return

            try {
                await deleteDoc(doc(db, 'usuarios', uid))
                usuariosCache = usuariosCache.filter((u) => u.uid !== uid)
                renderizarTabla()
                mostrarAlerta('Usuario eliminado exitosamente.')
            } catch (error) {
                console.error('Error al eliminar usuario:', error)
                mostrarAlerta('No se pudo eliminar el usuario.', true)
            }
        }
    })

    formEditar?.addEventListener('submit', async(e) => {
        e.preventDefault()

        const uid = document.getElementById('edit-uid').value
        const nuevoNombre = document.getElementById('edit-nombre').value.trim()
        const nuevoRol = document.getElementById('edit-rol').value

        if(!nuevoNombre)
            return

        try {
            await updateDoc(doc(db, 'usuarios', uid), {
                nombre: nuevoNombre,
                rol: nuevoRol
            })

            const index = usuariosCache.findIndex((u) => u.uid === uid)
            if (index !== -1){
                usuariosCache[index].nombre = nuevoNombre
                usuariosCache[index].rol = nuevoRol
            }

            renderizarTabla()
            cerrarModalEdicion()
            mostrarAlerta('Perfil de usuario actualizado.')
        } catch (error) {
            console.error('Error al actualizar usuario:', error)
            mostrarAlerta('No se pudieron guardar los cambios.', true)
        }
    })

    document.getElementById('btn-cerrar-modal')?.addEventListener('click', cerrarModalEdicion)
    document.getElementById('btn-cancelar-modal')?.addEventListener('click', cerrarModalEdicion)

    modal?.addEventListener('click', (e) => {
        if(e.target === modal)
            cerrarModalEdicion()
    })
}

async function iniciarAdmin(){
    const usuario = await usuarioActual()

    if(!usuario){
        window.location.href = 'login.html'
        return
    }
    if(usuario.rol !== 'admin'){
        window.location.href = 'index.html'
        return
    }
    
    uidAdminActual = usuario.uid
    document.getElementById('contenido-admin')?.classList.remove('hidden')
    configurarEventos()

    try {
        await cargarUsuarios(usuario.uid)
    } catch (error) {
        console.error('Error cargado panel:', error)
        mostrarAlerta('Error al cargar los datos.', true)
    }
}

iniciarAdmin()