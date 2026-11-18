// Datos ficticios exclusivos de la revisión 1. No sustituyen la capa Firestore.
export const categorias = { iluminacion:'Iluminación', computo:'Cómputo', limpieza:'Limpieza', mantenimiento:'Mantenimiento general', mobiliario:'Mobiliario' }
export const edificios = { 'edificio-a':'Edificio A', 'edificio-b':'Edificio B', biblioteca:'Biblioteca', 'lab-computo':'Laboratorio de Cómputo' }
const creation = (fecha) => ({ estadoNuevo:'reportado', fecha, responsable:'Reportante de muestra', comentario:'Se registró el reporte y se generó su folio.' })
export const incidenciasMuestra = [
  { id:'demo-006', folio:'RC-2026-0006', titulo:'Lámpara fundida en el pasillo', descripcion:'La luminaria del pasillo de planta alta no enciende. El área queda con poca iluminación durante las clases de la tarde.', categoriaId:'iluminacion', edificioId:'edificio-a', aula:'Pasillo de planta alta', prioridad:'media', estado:'reportado', fechaCreacion:'2026-11-18T15:30:00Z', historial:[creation('2026-11-18T15:30:00Z')] },
  { id:'demo-005', folio:'RC-2026-0005', titulo:'Computadora del laboratorio no enciende', descripcion:'El equipo número 12 no enciende al presionar el botón. Se revisó que el cable de alimentación estuviera conectado. Las prácticas se realizan en otro equipo.', categoriaId:'computo', edificioId:'lab-computo', aula:'Laboratorio 1 · Equipo 12', prioridad:'alta', estado:'en_proceso', fechaCreacion:'2026-11-17T16:15:00Z', historial:[creation('2026-11-17T16:15:00Z'), {estadoNuevo:'en_proceso',fecha:'2026-11-18T14:00:00Z',responsable:'Soporte técnico de muestra',comentario:'Equipo en revisión. Se verificará la fuente de alimentación.'}] },
  { id:'demo-004', folio:'RC-2026-0004', titulo:'Mesa de lectura con una pata floja', descripcion:'Una mesa de la zona de lectura se mueve al apoyar materiales. Se requiere ajustar la unión de una de las patas.', categoriaId:'mobiliario', edificioId:'biblioteca', aula:'Sala de lectura · Mesa 4', prioridad:'baja', estado:'reportado', fechaCreacion:'2026-11-17T14:20:00Z', historial:[creation('2026-11-17T14:20:00Z')] },
  { id:'demo-003', folio:'RC-2026-0003', titulo:'Fuga de agua en el lavabo', descripcion:'La llave del lavabo no cierra por completo y deja caer agua de manera continua. El espacio se encuentra señalizado para su revisión.', categoriaId:'mantenimiento', edificioId:'edificio-b', aula:'Sanitarios · Planta baja', prioridad:'alta', estado:'en_proceso', fechaCreacion:'2026-11-16T17:00:00Z', historial:[creation('2026-11-16T17:00:00Z'),{estadoNuevo:'en_proceso',fecha:'2026-11-17T15:00:00Z',responsable:'Mantenimiento de muestra',comentario:'Se identificó desgaste en la llave. Se prepara el repuesto.'}] },
  { id:'demo-002', folio:'RC-2026-0002', titulo:'Limpieza de la zona de estudio', descripcion:'Se solicitó limpieza de las mesas y del piso en el área de estudio después de una actividad académica.', categoriaId:'limpieza', edificioId:'biblioteca', aula:'Zona de estudio grupal', prioridad:'media', estado:'resuelto', fechaCreacion:'2026-11-15T18:10:00Z', historial:[creation('2026-11-15T18:10:00Z'),{estadoNuevo:'en_proceso',fecha:'2026-11-16T14:00:00Z',responsable:'Limpieza de muestra',comentario:'Personal asignado para atender el área.'},{estadoNuevo:'resuelto',fecha:'2026-11-16T16:30:00Z',responsable:'Limpieza de muestra',comentario:'Se realizó limpieza de mesas y piso. El área está lista para usarse.'}] },
  { id:'demo-001', folio:'RC-2026-0001', titulo:'Proyector sin señal en el aula', descripcion:'El proyector del aula no mostraba imagen al conectar el equipo. Se solicitó la revisión del cable de video y de la entrada seleccionada.', categoriaId:'computo', edificioId:'edificio-a', aula:'Aula A-102', prioridad:'media', estado:'resuelto', fechaCreacion:'2026-11-14T16:00:00Z', historial:[creation('2026-11-14T16:00:00Z'),{estadoNuevo:'en_proceso',fecha:'2026-11-15T14:00:00Z',responsable:'Soporte técnico de muestra',comentario:'Se revisó la conexión y el cable HDMI.'},{estadoNuevo:'resuelto',fecha:'2026-11-15T17:00:00Z',responsable:'Soporte técnico de muestra',comentario:'Se reemplazó el cable dañado y se verificó la proyección.'}] }
]

// Solo el modo explícito «Probar sin enviar» usa esta memoria de la pestaña.
// No se almacena en Firebase ni se ofrece como persistencia real.
let sessionReports = []
try { sessionReports = JSON.parse(sessionStorage.getItem('reportacampus-demo') || '[]') } catch { /* almacenamiento no disponible */ }
if (!Array.isArray(sessionReports)) sessionReports = []
export function getDemoReports() {
  return [...sessionReports, ...incidenciasMuestra].sort((a,b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
}
export function createDemoReport(payload) {
  const id = `muestra-${crypto.randomUUID()}`
  const fechaCreacion = new Date().toISOString()
  const folio = `DEMO-${new Date().getFullYear()}-${id.slice(-8).toUpperCase()}`
  const item = { ...payload, id, folio, fechaCreacion, prioridad:'media', estado:'reportado', historial:[creation(fechaCreacion)] }
  sessionReports.unshift(item)
  try { sessionStorage.setItem('reportacampus-demo', JSON.stringify(sessionReports)) } catch { /* La interfaz sigue disponible sin almacenamiento. */ }
  return item
}
