export function esPersonal(usuario) {
    return usuario?.rol === 'responsable' || usuario?.rol === 'admin';
}

export function puedeEditar(usuario, incidencia) {
    if (!usuario || !incidencia || incidencia.estado === 'resuelto') {
        return false;
    }
    return (
        esPersonal(usuario) ||
        (usuario.rol === 'reportante' &&
            incidencia.reportanteId === usuario.uid &&
            incidencia.estado === 'reportado')
    );
}
