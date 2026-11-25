import { db } from './firebase.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const CATEGORIAS_INICIALES = [
    { id: 'iluminacion', nombre: 'Iluminación' },
    { id: 'computo', nombre: 'Cómputo' },
    { id: 'limpieza', nombre: 'Limpieza' },
    { id: 'mantenimiento', nombre: 'Mantenimiento general' },
    { id: 'mobiliario', nombre: 'Mobiliario' }
];

const EDIFICIOS_INICIALES = [
    {
        id: 'edificio-a',
        nombre: 'Edificio A',
        aulas: ['Aula A-101', 'Aula A-102', 'Aula A-201', 'Pasillo Planta Alta']
    },
    {
        id: 'edificio-b',
        nombre: 'Edificio B',
        aulas: ['Aula B-101', 'Aula B-102', 'Sala de Juntas', 'Sanitarios Planta Baja']
    },
    {
        id: 'biblioteca',
        nombre: 'Biblioteca',
        aulas: ['Sala General', 'Cubículos de Estudio', 'Módulo de Préstamo']
    },
    {
        id: 'lab-computo',
        nombre: 'Laboratorio de Cómputo',
        aulas: ['Lab Redes', 'Lab Desarrollo de Software', 'Centro de Servidores']
    }
];

export async function ejecutarSemillaCatalogos() {
    for (const cat of CATEGORIAS_INICIALES) {
        await setDoc(doc(db, 'categorias', cat.id), {
            nombre: cat.nombre
        }, { merge: true });
    }

    for (const edif of EDIFICIOS_INICIALES) {
        await setDoc(doc(db, 'edificios', edif.id), {
            nombre: edif.nombre,
            aulas: edif.aulas
        }, { merge: true });
    }

    console.log('✅ Catálogos sembrados correctamente sin duplicados.');
}