import { db, collection, getDocs, query, orderBy, doc, getDoc } from './firebase.js'

function fechaAISO(valor) {
  if (!valor) 
    return ''
  if (typeof valor.toDate === 'function') 
    return valor.toDate().toISOString()
  
  return String(valor)
}

export async function obtenerIncidencias() {
  const consulta = query(collection(db, 'incidencias'), orderBy('fechaCreacion', 'desc'))
  const snapshot = await getDocs(consulta)
  
  return snapshot.docs.map(d => {
    const datos = d.data()
    return { id: d.id, ...datos, fechaCreacion: fechaAISO(datos.fechaCreacion) }
  })
}

export async function obtenerIncidencia(id) {
  const snap = await getDoc(doc(db, 'incidencias', id))
  if (!snap.exists()) return null

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