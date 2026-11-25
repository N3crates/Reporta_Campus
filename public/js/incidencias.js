import { db, collection, getDocs, query, orderBy, doc, getDoc } from './firebase.js'
import { usuarioActual } from './auth.js'
import { where, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

function fechaAISO(valor) {
  if (!valor) 
    return ''
  if (typeof valor.toDate === 'function') 
    return valor.toDate().toISOString()
  
  return String(valor)
}

export async function obtenerIncidencias(filtros = {}) {
  const usuario = await usuarioActual()
  if(!usuario)
    return []

  const colRef = collection(db, 'incidencias')
  const esStaff = usuario.rol === 'responsable' || usuario.rol === 'admin'
  const restricciones = []
  
  if(!esStaff){
    restricciones.push(where('reportanteId', '==', usuario.uid))
  }
  if(filtros.estado){
    restricciones.push(where('estado', '==', filtros.estado))
  }
  if(filtros.prioridad){
    restricciones.push(where('prioridad', '==', filtros.prioridad))
  }
  if(filtros.categoriaId){
    restricciones.push(where('categoriaId', '==', filtros.categoriaId))
  }
  if(filtros.edificioId){
    restricciones.push(where('edificioId', '==', filtros.edificioId))
  }

  restricciones.push(orderBy('fechaCreacion', 'desc'))

  const consulta = query(colRef, ...restricciones)
  const snapshot = await getDocs(consulta)

  return snapshot.docs.map(d => {
    const datos = d.data()
    return{
      id: d.id,
      ...datos,
      fechaCreacion: fechaAISO(datos.fechaCreacion)
    }
  })
}

export async function obtenerIncidencia(id) {
  const snap = await getDoc(doc(db, 'incidencias', id))
  if (!snap.exists()) 
    return null

  const datos = snap.data()
  let historial = []
  try {
    const histSnap = await getDocs(query(collection(db, 'incidencias', id, 'historial_estados'), orderBy('fecha', 'asc')))
    historial = histSnap.docs.map(h => {
      const d = h.data()
      return { 
        id: h.id, 
        ...d, 
        fecha: fechaAISO(d.fecha) 
      }
    })
  } catch (error) {
    console.warn('No se pudo leer el historial:', error)
  }

  return {
    id: snap.id,
    ...datos,
    fechaCreacion: fechaAISO(datos.fechaCreacion),
    historial
  }
}

export async function actualizarIncidencia(id, { prioridad, responsableId, estado } = {}){
  const cambios = { fechaActualizacion: serverTimestamp() }

  if(prioridad !== undefined){
    cambios.prioridad = prioridad
  }
  if(responsableId !== undefined){
    cambios.responsableId = responsableId
  }
  if(estado !== undefined){
    cambios.estado = estado
  }

  await updateDoc(doc(db, 'incidencias', id), cambios)
}