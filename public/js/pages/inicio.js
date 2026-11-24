import { obtenerIncidencias } from '../incidencias.js'
import { usuarioActual } from '../auth.js'

function formatearConteo(numero){
    return String(numero).padStart(2, '0')
}

async function cargarEstadisticas(){
    const elReportadas = document.getElementById('conteo-reportadas')
    const elProceso = document.getElementById('conteo-proceso')
    const elResueltas = document.getElementById('conteo-resueltas')

    if(!elReportadas || !elProceso || !elResueltas)
        return

    try {
        const usuario = await usuarioActual()
        if(!usuario){
            elReportadas.textContent = '00'
            elProceso.textContent = '00'
            elResueltas.textContent = '00'
            return
        }

        const incidencias = await obtenerIncidencias()
        const reportadas = incidencias.filter(i => i.estado === 'reportado').length
        const enProceso = incidencias.filter(i => i.estado === 'en_proceso').length
        const resueltas = incidencias.filter(i => i.estado === 'resuelto').length

        elReportadas.textContent = formatearConteo(reportadas)
        elProceso.textContent = formatearConteo(enProceso)
        elResueltas.textContent = formatearConteo(resueltas)

    } catch (error) {
        console.warn('No se pudieron cargar las estadisticas:', error)
        elReportadas.textContent = '00'
        elProceso.textContent = '00'
        elResueltas.textContent = '00'
    }
}