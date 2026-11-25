import { usuarioActual } from '../auth.js'
import { obtenerCategorias, obtenerEdificios } from '../catalogos.js'
import { registrarIncidencia } from '../folio.js'

usuarioActual().then((usuario) => {
    if(!usuario){
        window.location.href = 'login.html'
    }
})

// Validadores
function required(value, fieldName) {
    if (value === undefined || value === null || String(value).trim() === '') {
        return `${fieldName} es obligatorio`;
    }
    return null;
}

function maxLength(value, max, fieldName) {
    if (value && String(value).trim().length > max) {
        return `${fieldName} no puede exceder ${max} caracteres`;
    }
    return null;
}

const form = document.getElementById('form-reporte');
const errorAlert = document.getElementById('error-alert');
const successAlert = document.getElementById('success-alert');
const folioGeneradoEl = document.getElementById('folio-generado');
const btnSubmit = document.getElementById('btn-submit');
const selectCategoria = document.getElementById('categoriaId')
const selectEdificio = document.getElementById('edificioId')
const selectAula = document.getElementById('aula')

let edificiosCargados = []

function mostrarErrores(errores) {
    errorAlert.replaceChildren();
    const titulo = document.createElement('p');
    titulo.className = 'font-bold mb-1';
    titulo.textContent = 'Por favor corrige los siguientes campos:';
    const lista = document.createElement('ul');
    lista.className = 'list-disc list-inside space-y-1';

    for (const error of errores) {
        const elemento = document.createElement('li');
        elemento.textContent = error;
        lista.append(elemento);
    }

    errorAlert.append(titulo, lista);
    errorAlert.classList.remove('hidden');
    errorAlert.focus();
    errorAlert.scrollIntoView({ behavior: 'smooth' });
}

function ocultarAlertas() {
    errorAlert.classList.add('hidden');
    successAlert.classList.add('hidden');
}

function setLoading(isLoading) {
    btnSubmit.disabled = isLoading
    btnSubmit.textContent = isLoading ? 'Registrando reporte...' : 'Enviar reporte'
    btnSubmit.classList.toggle('opacity-50', isLoading)
    btnSubmit.classList.toggle('cursor-not-allowed', isLoading)
}

function poblarAulas(edificioId){
    selectAula.replaceChildren()
   
    const edificio = edificiosCargados.find(e => e.id === edificioId)
    const aulas = edificio?.aulas ?? []

    if(!edificioId || aulas.length === 0){
        selectAula.desabled = true

        const opt = document.createElement('option')
        opt.value = ''
        opt.textContent = edificioId ? 'Sin aulas registradas' : 'Selecciona un edificio'
        selectAula.append(opt)
        return
    }

    selectAula.disabled = false
    
    const defaultOpt = document.createElement('option')
    defaultOpt.value = ''
    defaultOpt.textContent = 'Selecciona un aula o espacio'
    selectAula.append(defaultOpt)

    for(const aula of aulas){
        const opt = document.createElement('option')
        opt.value = aula
        opt.textContent = aula
        selectAula.append(opt)
    }
}

async function iniciarFormulario(){
    const usuario = await usuarioActual()
    if(!usuario){
        window.location.href = 'login.html'
        return
    }

    try {
        const [categorias, edificios] = await Promise.all([
            obtenerCategorias(),
            obtenerEdificios()
        ])

        edificiosCargados = edificios

        selectCategoria.replaceChildren(new Option('Selecciona una categoria', ''))
        for(const cat of categorias){
            selectCategoria.append(new Option(cat.nombre, cat.id))
        }

        selectEdificio.replaceChildren(new Option('Selecciona un edificio', ''))
        for(const edif of edificios){
            selectEdificio.append(new Option(edif.nombre, edif.id))
        }

        poblarAulas('')
    } catch (error) {
        console.error('Error al cargar catalogos:', error)
        mostrarErrores(['No se pudieron cargar las categorias y edificios desde la base de datos.'])
    }
}

selectEdificio.addEventListener('change', (e) => {
    poblarAulas(e.target.value)
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    ocultarAlertas();

    const usuario = await usuarioActual()
    if(!usuario){
        window.location.href = 'login.html'
        return
    }

    const payload = {
        titulo: document.getElementById('titulo').value,
        categoriaId: selectCategoria.value,
        edificioId: selectEdificio.value,
        aula: selectAula.value,
        descripcion: document.getElementById('descripcion').value,
        reportanteId: usuario.id,
        reportanteNombre: usuario.nombre || usuario.email,
        correoReportante: usuario.correo || usuario.email
    };

    // Validaciones
    const errores = [
        required(payload.titulo, 'El título'),
        maxLength(payload.titulo, 100, 'El título'),
        required(payload.categoriaId, 'La categoría'),
        required(payload.edificioId, 'El edificio'),
        required(payload.aula, 'El aula o espacio'),
        required(payload.descripcion, 'La descripción'),
        maxLength(payload.descripcion, 500, 'La descripción')
    ].filter(Boolean); // Filtra los nulos

    if (errores.length > 0) {
        mostrarErrores(errores);
        return;
    }

    try {
        setLoading(true)
        
        const resultado = await registrarIncidencia({ ...payload, prioridad: 'media'})
        folioGeneradoEl.textContent = resultado.folio

        const detailLink = document.getElementById('success-detail')
        detailLink.href = `detalle.html?id=${encodeURIComponent(resultado.id)}`
        detailLink.textContent = 'Ver detalle'

        successAlert.classList.remove('hidden')
        form.reset()
        poblarAulas('')
        updateCounter()
        successAlert.scrollIntoView({ behavior: 'smooth' })
    } catch (error) {
        console.error('Error al registrar reporte:', error);
        mostrarErrores([
            'Ocurrió un error al guardar la incidencia en Firestore. Verifica la configuración.'
        ]);
    } finally {
        setLoading(false);
    }
});

function updateCounter() {
    document.getElementById('descripcion-contador').textContent =
        `${document.getElementById('descripcion').value.length} / 500`;
}
document.getElementById('descripcion').addEventListener('input', updateCounter);

iniciarFormulario()