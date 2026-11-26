// Función de dominio compartida: días completos transcurridos, sin fechas de muestra.
export function calcularAntiguedad(fechaCreacion, fechaResolucion = null, ahora = new Date()) {
    if (fechaCreacion == null || fechaCreacion === '') {
        return null;
    }
    const inicio = new Date(fechaCreacion).getTime();
    const fin = new Date(fechaResolucion ?? ahora).getTime();
    if (!Number.isFinite(inicio) || !Number.isFinite(fin)) {
        return null;
    }
    const dias = Math.max(0, Math.floor((fin - inicio) / 86400000));
    let rango = 'Reciente';
    if (dias > 7) {
        rango = 'Rezagada';
    } else if (dias > 2) {
        rango = 'Atención';
    }
    return { dias, rango };
}

export function antiguedadDeIncidencia(incidencia) {
    if (incidencia.estado === 'resuelto') {
        if (!incidencia.fechaResolucion) {
            return null;
        }
        return calcularAntiguedad(incidencia.fechaCreacion, incidencia.fechaResolucion);
    }
    if (['reportado', 'en_proceso'].includes(incidencia.estado)) {
        return calcularAntiguedad(incidencia.fechaCreacion);
    }
    return null;
}

export function mostrarAntiguedad(elemento, incidencia) {
    const antiguedad = antiguedadDeIncidencia(incidencia);
    if (!antiguedad || incidencia.estado === 'resuelto') {
        elemento.hidden = true;
        return;
    }
    const unidad = antiguedad.dias === 1 ? 'día' : 'días';
    elemento.querySelector('[data-antiguedad-texto]').textContent =
        antiguedad.rango + ' · ' + antiguedad.dias + ' ' + unidad;
    elemento.hidden = false;
}
