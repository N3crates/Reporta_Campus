// Función de dominio compartida: días completos transcurridos, sin fechas de muestra.
export function calcularAntiguedad(fechaCreacion, fechaResolucion = null, ahora = new Date()) {
    const inicio = new Date(fechaCreacion).getTime();
    const fin = new Date(fechaResolucion || ahora).getTime();
    if (!Number.isFinite(inicio) || !Number.isFinite(fin)) {
        return null;
    }
    const dias = Math.max(0, Math.floor((fin - inicio) / 86400000));
    let rango = 'Reciente';
    if (dias > 7) {
        rango = 'Más de una semana';
    } else if (dias > 2) {
        rango = 'En seguimiento';
    }
    return { dias, rango };
}
