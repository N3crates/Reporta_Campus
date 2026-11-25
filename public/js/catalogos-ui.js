import { obtenerMapaCatalogos } from './catalogos.js';

export async function obtenerCatalogos() {
    const { categorias, edificios } = await obtenerMapaCatalogos();
    return { categorias, edificios };
}

export function llenarOpciones(select, datos, titulo, valorActual = '') {
    select.replaceChildren(new Option(titulo, ''));
    for (const dato of datos) {
        if ((dato.activa === false || dato.activo === false) && dato.id !== valorActual) {
            continue;
        }
        select.add(new Option(dato.nombre || dato.id, dato.id));
    }
    if (
        valorActual &&
        !Array.from(select.options).some(function (opcion) {
            return opcion.value === valorActual;
        })
    ) {
        select.add(new Option(valorActual + ' (sin catálogo)', valorActual));
    }
    select.value = valorActual;
}

export function nombreCatalogo(datos, id) {
    return (
        datos.find(function (dato) {
            return dato.id === id;
        })?.nombre ||
        id ||
        'Sin definir'
    );
}
