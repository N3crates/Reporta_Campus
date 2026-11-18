import { registrarIncidencia } from '../folio.js'

// Validadores 
function required(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} es obligatorio`
  }
  return null
}

function maxLength(value, max, fieldName) {
  if (value && String(value).trim().length > max) {
    return `${fieldName} no puede exceder ${max} caracteres`
  }
  return null
}

const form = document.getElementById('form-reporte')
const errorAlert = document.getElementById('error-alert')
const successAlert = document.getElementById('success-alert')
const folioGeneradoEl = document.getElementById('folio-generado')
const btnSubmit = document.getElementById('btn-submit')

function mostrarErrores(errores) {
  errorAlert.innerHTML = `
    <p class="font-bold mb-1">Por favor corrige los siguientes campos:</p>
    <ul class="list-disc list-inside space-y-1">
      ${errores.map((err) => `<li>${err}</li>`).join('')}
    </ul>
  `
  errorAlert.classList.remove('hidden')
  errorAlert.scrollIntoView({ behavior: 'smooth' })
}

function ocultarAlertas() {
  errorAlert.classList.add('hidden')
  successAlert.classList.add('hidden')
}

function setLoading(isLoading) {
  if (isLoading) {
    btnSubmit.disabled = true
    btnSubmit.textContent = 'Registrando reporte...'
    btnSubmit.classList.add('opacity-50', 'cursor-not-allowed')
  } else {
    btnSubmit.disabled = false
    btnSubmit.textContent = 'Enviar Reporte'
    btnSubmit.classList.remove('opacity-50', 'cursor-not-allowed')
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  ocultarAlertas()

  const payload = {
    titulo: document.getElementById('titulo').value,
    categoriaId: document.getElementById('categoriaId').value,
    edificioId: document.getElementById('edificioId').value,
    aula: document.getElementById('aula').value,
    descripcion: document.getElementById('descripcion').value
  }

  // Validaciones
  const errores = [
    required(payload.titulo, 'El título'),
    maxLength(payload.titulo, 100, 'El título'),
    required(payload.categoriaId, 'La categoría'),
    required(payload.edificioId, 'El edificio'),
    required(payload.aula, 'El aula o espacio'),
    required(payload.descripcion, 'La descripción'),
    maxLength(payload.descripcion, 500, 'La descripción')
  ].filter(Boolean) // Filtra los nulos

  if (errores.length > 0) {
    mostrarErrores(errores)
    return
  }

  try {
    setLoading(true)

    const resultado = await registrarIncidencia({
      ...payload,
      prioridad: 'media'
    })

    // Exito: mostramos el folio
    folioGeneradoEl.textContent = resultado.folio
    successAlert.classList.remove('hidden')
    form.reset()
    successAlert.scrollIntoView({ behavior: 'smooth' })

  } catch (error) {
    console.error('Error al registrar reporte:', error)
    mostrarErrores(['Ocurrió un error al guardar la incidencia en Firestore. Verifica la configuración.'])
  } finally {
    setLoading(false)
  }
})