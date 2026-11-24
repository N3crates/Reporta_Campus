import { db, collection, getDocs, query, orderBy, doc, getDoc } from './firebase.js'
import { usuarioActual } from './auth.js'
import { where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

function fechaAISO(valor) {
  if (!valor) 
    return ''
  if (typeof valor.toDate === 'function') 
    return valor.toDate().toISOString()
  
  return String(valor)
}

export async function obtenerIncidencias() {
  const usuario = await usuarioActual()
  if(!usuario)
    return []

  const colRef = collection(db, 'incidencias')
  const esStaff = usuario.rol === 'responsable' || usuario.rol === 'admin'
  const consulta = esStaff ? query(colRef, orderBy('fechaCreacion', 'desc')) : query(colRef, where('reportanteId', '==', usuario.uid), orderBy('fechaCreacion', 'desc'))
  const snapshot = await getDocs(consulta)
  
  const lista = snapshot.docs.map(d => {
    const datos = d.data()
    return{
      id: d.id,
      ...datos,
      fechaCreacion: fechaAISO(datos.fechaCreacion)
    }
  })
  if(!esStaff){
    lista.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
  }

  return lista
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
      return { id: h.id, ...d, fecha: fechaAISO(d.fecha) }
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