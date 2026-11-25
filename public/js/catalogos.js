import { db, collection, getDocs, query, orderBy } from './firebase.js'

let cacheCategorias = null
let cacheEdificios = null

export async function obtenerCategorias(forzar = false){
    if(cacheCategorias && !forzar)
        return cacheCategorias

    const snap = await getDocs(query(collection(db, 'categorias'), orderBy('nombre', 'asc')))
    cacheCategorias = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
    }))

    return cacheCategorias
}

export async function obtenerEdificios(forzar = false){
    if(cacheEdificios && !forzar)
        return cacheEdificios

    const snap = await getDocs(query(collection(db, 'edificios'), orderBy('nombre', 'asc')))
    cacheEdificios = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
    }))

    return cacheEdificios
}

export async function obtenerMapaCatalogos(){
    const[categorias, edificios] = await Promise.all([
        obtenerCategorias(),
        obtenerEdificios()
    ])

    return{
        categoriasMap: Object.fromEntries(categorias.map(c => [c.id, c.nombre])),
        edificiosMap: Object.fromEntries(edificios.map(e => [e.id, e.nombre])),
        categorias, edificios
    }
}