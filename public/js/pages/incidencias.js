import { getDemoReports, categorias, edificios } from '../demo-data.js'
import { escapeHTML as esc, stateBadge, formatDate, categoryIcon } from '../ui.js'

const form = document.getElementById('filtros')
const list = document.getElementById('lista-incidencias')
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

function render() {
  const query = normalize(document.getElementById('buscar').value)
  const selected = Object.fromEntries(['estado','prioridad','categoria','edificio'].map(key => [key, document.getElementById(key).value]))
  const reports = getDemoReports().filter(item =>
    (!query || normalize(`${item.titulo} ${item.folio}`).includes(query)) &&
    (!selected.estado || item.estado === selected.estado) &&
    (!selected.prioridad || item.prioridad === selected.prioridad) &&
    (!selected.categoria || item.categoriaId === selected.categoria) &&
    (!selected.edificio || item.edificioId === selected.edificio)
  )
  document.getElementById('resultados-conteo').textContent = `${reports.length} ${reports.length === 1 ? 'incidencia encontrada' : 'incidencias encontradas'}`
  document.getElementById('estado-vacio').classList.toggle('hidden', reports.length !== 0)
  list.innerHTML = reports.map(item => `<article class="panel p-6 flex flex-col min-w-0 hover:border-[#8c6e39] transition-colors">
    <div class="flex justify-between items-center gap-3"><span class="w-11 h-11 rounded-xl bg-[#fff5cd] text-[#0a263d] grid place-items-center">${categoryIcon(item.categoriaId)}</span>${stateBadge(item.estado)}</div>
    <p class="text-[10px] font-bold tracking-wider text-stone-500 mt-6 [overflow-wrap:anywhere]">${esc(item.folio)}</p>
    <h2 class="text-base font-bold leading-6 mt-2 [overflow-wrap:anywhere]"><a class="hover:underline" href="detalle.html?id=${encodeURIComponent(item.id)}">${esc(item.titulo)}</a></h2>
    <p class="text-xs text-stone-500 mt-2">${esc(categorias[item.categoriaId])}</p>
    <div class="border-t border-stone-100 mt-5 pt-4 space-y-2 text-xs text-stone-500"><p class="[overflow-wrap:anywhere]">${esc(edificios[item.edificioId])} · ${esc(item.aula)}</p><div class="flex flex-wrap justify-between gap-2"><p>Prioridad <strong class="${item.prioridad === 'alta' ? 'text-orange-800' : 'text-stone-700'}">${esc(item.prioridad)}</strong></p><time datetime="${esc(item.fechaCreacion)}">${formatDate(item.fechaCreacion)}</time></div></div>
    <a href="detalle.html?id=${encodeURIComponent(item.id)}" aria-label="Ver detalle: ${esc(item.titulo)}" class="flex justify-between items-center text-xs font-bold text-[#0a263d] pt-5 mt-auto min-h-12">Ver detalle <span aria-hidden="true">↗</span></a>
  </article>`).join('')
}
function clearFilters() { form.reset(); render() }
form.addEventListener('input', render)
form.addEventListener('change', render)
form.addEventListener('submit', event => { event.preventDefault(); render() })
document.getElementById('limpiar-filtros').addEventListener('click', clearFilters)
document.getElementById('limpiar-vacio').addEventListener('click', clearFilters)
render()
