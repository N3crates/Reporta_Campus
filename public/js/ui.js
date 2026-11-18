// Navegación compartida, independiente de Firebase.
const toggle = document.getElementById('menu-toggle')
const nav = document.getElementById('navegacion')
const desktop = window.matchMedia('(min-width: 768px)')

function setOpen(open) {
  toggle.setAttribute('aria-expanded', String(open))
  nav.classList.toggle('hidden', !open)
  nav.classList.toggle('flex', open)
}
toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'))
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setOpen(false)
    toggle.focus()
  }
})
nav.addEventListener('click', event => {
  if (event.target.closest('a') && !desktop.matches) setOpen(false)
})
desktop.addEventListener('change', () => setOpen(false))

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
}

export const estados = {
  reportado: { label: 'Reportado', css: 'badge-reported' },
  en_proceso: { label: 'En proceso', css: 'badge-progress' },
  resuelto: { label: 'Resuelto', css: 'badge-resolved' }
}
export function stateBadge(estado) {
  const item = estados[estado]
  return item ? `<span class="badge ${item.css}">${item.label}</span>` : ''
}
export function formatDate(value, withTime = false) {
  return new Intl.DateTimeFormat('es-MX', {day:'numeric', month:'short', year:'numeric', timeZone:'America/Mexico_City', ...(withTime ? {hour:'2-digit', minute:'2-digit'} : {})}).format(new Date(value))
}
export function categoryIcon(category) {
  const paths = {
    iluminacion: '<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"/>',
    computo: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    limpieza: '<path d="m14 3-4 11m-5 0h9l3 7H2l3-7Zm3 1v5m4-4v4m7-14v4m-2-2h4"/>',
    mantenimiento: '<path d="m14 7-7 7-3 1-2 5 2 2 5-2 1-3 7-7m-3-3a5 5 0 0 1 6-5l-3 3 3 3 3-3a5 5 0 0 1-6 6"/>',
    mobiliario: '<path d="M5 11V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M4 11h16v7H4zM6 18v4m12-4v4"/>'
  }
  return `<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[category] || paths.mantenimiento}</svg>`
}
