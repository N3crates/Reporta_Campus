// Verifica los ejemplos existentes de frontend; no escribe en Firebase.
const assert = require('node:assert/strict')
const { test, before } = require('node:test')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')

let incidencias, categorias, edificios
const estados = ['reportado', 'en_proceso', 'resuelto']
const prioridades = ['baja', 'media', 'alta']

before(async () => {
  // Carga el modulo ES sin cambiar el tipo de modulos del proyecto ni requerir
  // un navegador. Solo se comprueban los ejemplos base, no sessionStorage.
  const source = readFileSync(resolve(__dirname, '../public/js/demo-data.js'), 'utf8')
  const data = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))
  incidencias = data.incidenciasMuestra
  categorias = data.categorias
  edificios = data.edificios
})

test('Los ejemplos cubren todos los estados y prioridades acordados', () => {
  assert(incidencias.length > 0)
  assert.deepEqual([...new Set(incidencias.map(item => item.estado))].sort(), [...estados].sort())
  assert.deepEqual([...new Set(incidencias.map(item => item.prioridad))].sort(), [...prioridades].sort())
})

test('Cada ejemplo tiene ID y folio unicos, campos validos y catalogos existentes', () => {
  assert.equal(new Set(incidencias.map(item => item.id)).size, incidencias.length)
  assert.equal(new Set(incidencias.map(item => item.folio)).size, incidencias.length)
  for (const item of incidencias) {
    assert.equal(typeof item.id, 'string')
    assert(item.id.trim())
    assert.match(item.folio, /^RC-\d{4}-\d{4,}$/)
    for (const [field, limit] of [['titulo', 100], ['descripcion', 500], ['aula', Infinity]]) {
      assert.equal(typeof item[field], 'string', `${item.id}: ${field}`)
      assert(item[field].trim().length > 0 && item[field].trim().length <= limit, `${item.id}: ${field}`)
    }
    assert(Object.hasOwn(categorias, item.categoriaId), `${item.id}: categoria`)
    assert(Object.hasOwn(edificios, item.edificioId), `${item.id}: edificio`)
    assert(Number.isFinite(Date.parse(item.fechaCreacion)), `${item.id}: fechaCreacion`)
    assert.equal(item.folio.split('-')[1], String(new Date(item.fechaCreacion).getUTCFullYear()))
  }
})

test('Los historiales comienzan en reportado, avanzan sin saltos y coinciden con el estado actual', () => {
  for (const item of incidencias) {
    assert(Array.isArray(item.historial) && item.historial.length > 0, item.id)
    assert.equal(item.historial[0].estadoNuevo, 'reportado', item.id)
    let previousDate = Date.parse(item.fechaCreacion)
    for (const [index, movimiento] of item.historial.entries()) {
      assert.equal(movimiento.estadoNuevo, estados[index], `${item.id}: transicion ${index}`)
      const date = Date.parse(movimiento.fecha)
      assert(Number.isFinite(date) && date >= previousDate, `${item.id}: fecha del movimiento ${index}`)
      if (index === 0) assert.equal(date, Date.parse(item.fechaCreacion), item.id)
      assert.equal(typeof movimiento.responsable, 'string', item.id)
      assert(movimiento.responsable.trim(), `${item.id}: responsable`)
      previousDate = date
    }
    assert.equal(item.historial.at(-1).estadoNuevo, item.estado, item.id)
  }
})

test('Las incidencias resueltas tienen comentario de resolucion', () => {
  for (const item of incidencias.filter(report => report.estado === 'resuelto')) {
    const cierre = item.historial.at(-1)
    assert.equal(typeof cierre.comentario, 'string', item.id)
    assert(cierre.comentario.trim(), `${item.id}: falta comentario de resolucion`)
  }
})
