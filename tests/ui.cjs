// Pruebas de navegador de la entrega de frontend. No escriben en Firebase.
const assert = require('node:assert/strict')
const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const { mkdir, writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')

const root = resolve(__dirname, '..')
const evidence = process.argv.includes('--evidence')
const origin = 'http://127.0.0.1:4175'
const captures = resolve(root, 'docs/capturas/revision-1')
const results = []
const errors = []
let browser, server

async function check(name, action) {
  await action()
  results.push({ prueba:name, resultado:'Correcto' })
  console.log('OK ' + name)
}
async function screenshot(page, name) {
  if (evidence) { await page.evaluate(() => document.fonts.ready); await page.screenshot({path:resolve(captures, name + '.png'),fullPage:true}) }
}
async function ready(page, path) {
  await page.goto(origin + '/' + path, {waitUntil:'networkidle'})
  await page.evaluate(() => document.fonts.ready)
}
async function noOverflow(page) {
  const sizes = await page.evaluate(() => ({document:document.documentElement.scrollWidth, viewport:innerWidth}))
  assert(sizes.document <= sizes.viewport, JSON.stringify(sizes))
}
async function fillReport(page, title = 'Lámpara de prueba de interfaz') {
  await page.locator('#titulo').fill(title)
  await page.locator('#categoriaId').selectOption('iluminacion')
  await page.locator('#edificioId').selectOption('edificio-a')
  await page.locator('#aula').fill('Pasillo A')
  await page.locator('#descripcion').fill('Descripción ficticia para verificar la interfaz sin escribir en Firebase.')
}

;(async () => {
  if (evidence) await mkdir(captures, {recursive:true})
  server = spawn(process.execPath, ['scripts/serve.mjs'], {cwd:root, env:{...process.env,PORT:'4175'}, stdio:['ignore','pipe','pipe']})
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.stdout.once('data', resolve)
    server.stderr.once('data', data => reject(new Error(String(data))))
  })
  browser = await chromium.launch({headless:true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH} : {})})
  const context = await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,locale:'es-MX',timezoneId:'America/Mexico_City'})
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  const pages = [['index.html','inicio'],['reportar.html','reportar'],['incidencias.html','incidencias'],['detalle.html?id=demo-001','detalle']]
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:width < 768 ? 844 : 1000})
    for (const [path,name] of pages) {
      await check(`${name}: carga y sin desborde a ${width}px`, async () => {
        await ready(page,path)
        assert.equal(await page.locator('h1').count(),1)
        await noOverflow(page)
        assert.equal(await page.locator('html').getAttribute('lang'),'es')
        if (width === 390 || width === 1440) await screenshot(page,`${name}-${width === 390 ? 'movil' : 'escritorio'}`)
      })
    }
  }
  await check('Tailwind y Google Fonts cargan desde CDN', async () => {
    assert.equal(await page.locator('header').evaluate(el => getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)')
    assert(await page.evaluate(() => document.fonts.check('700 16px "Plus Jakarta Sans"')))
    assert.equal(await page.locator('#navegacion').evaluate(el => getComputedStyle(el).display),'flex')
  })
  await page.setViewportSize({width:390,height:844})
  await ready(page,'index.html')
  await check('Menú móvil abre, Escape cierra y devuelve foco', async () => {
    const button = page.locator('#menu-toggle')
    assert.equal(await button.getAttribute('aria-expanded'),'false')
    assert(!(await page.locator('#navegacion').isVisible()))
    await button.click()
    assert.equal(await button.getAttribute('aria-expanded'),'true')
    assert(await page.locator('#navegacion').isVisible())
    await noOverflow(page)
    await screenshot(page,'menu-movil-abierto')
    await page.keyboard.press('Escape')
    assert.equal(await button.getAttribute('aria-expanded'),'false')
    assert(await button.evaluate(el => el === document.activeElement))
  })
  await check('Navegación móvil hacia formulario y listado', async () => {
    await page.locator('#menu-toggle').click()
    await page.locator('#navegacion a[href="reportar.html"]').click()
    await page.waitForURL('**/reportar.html')
    assert(await page.locator('#form-reporte').isVisible())
    await page.locator('#menu-toggle').click()
    await page.locator('#navegacion a[href="incidencias.html"]').click()
    await page.waitForURL('**/incidencias.html')
    await page.locator('#lista-incidencias article').first().waitFor()
  })
  await check('Búsqueda por folio y filtros combinados', async () => {
    await page.locator('#buscar').fill('RC-2026-0005')
    assert.equal(await page.locator('#lista-incidencias article').count(),1)
    await page.locator('#limpiar-filtros').click()
    await page.locator('#estado').selectOption('en_proceso')
    await page.locator('#prioridad').selectOption('alta')
    await page.locator('#categoria').selectOption('computo')
    await page.locator('#edificio').selectOption('lab-computo')
    assert.equal(await page.locator('#lista-incidencias article').count(),1)
    assert((await page.locator('#lista-incidencias').textContent()).includes('RC-2026-0005'))
  })
  await check('Estado vacío y recuperación al limpiar', async () => {
    await page.locator('#buscar').fill('sin coincidencias xyz')
    assert(await page.locator('#estado-vacio').isVisible())
    assert.equal(await page.locator('#lista-incidencias article').count(),0)
    await screenshot(page,'listado-sin-resultados')
    await page.locator('#limpiar-vacio').click()
    assert.equal(await page.locator('#lista-incidencias article').count(),6)
  })
  await check('Listado abre el detalle correspondiente y su historial', async () => {
    await page.locator('a[aria-label^="Ver detalle:"]').nth(1).click()
    await page.waitForURL('**/detalle.html?id=demo-005')
    assert((await page.locator('h1').textContent()).includes('Computadora'))
    assert.equal(await page.locator('#detalle-contenido ol li').count(),2)
    await page.getByRole('link',{name:'Volver al listado',exact:false}).click()
    await page.waitForURL('**/incidencias.html')
  })
  await check('Detalle inexistente presenta salida al listado', async () => {
    await ready(page,'detalle.html?id=no-existe')
    assert.equal(await page.locator('h1').textContent(),'Incidencia no encontrada')
    await screenshot(page,'detalle-no-encontrado')
  })
  await check('Formulario vacío valida sin cargar Firebase', async () => {
    await ready(page,'reportar.html')
    let adapterRequests = 0
    const listener = request => { if (request.url().endsWith('/js/folio.js')) adapterRequests++ }
    page.on('request', listener)
    await page.locator('#btn-submit').click()
    assert(await page.locator('#error-alert').isVisible())
    assert.equal(await page.locator('#error-alert li').count(),5)
    assert.equal(adapterRequests,0)
    await screenshot(page,'formulario-validacion')
    page.off('request',listener)
  })
  await check('Modo muestra recorre formulario → detalle → listado sin Firebase', async () => {
    await fillReport(page)
    await page.locator('#modo-demo').check()
    await page.locator('#btn-submit').click()
    assert(await page.locator('#success-alert').isVisible())
    assert.match(await page.locator('#folio-generado').textContent(),/^DEMO-/)
    assert.match(await page.locator('#success-note').textContent(),/No se guardó un reporte real/)
    await screenshot(page,'formulario-demostracion')
    await page.locator('#success-detail').click()
    await page.waitForURL('**/detalle.html?id=muestra-*')
    assert.equal(await page.locator('h1').textContent(),'Lámpara de prueba de interfaz')
    await page.getByRole('link',{name:'Volver al listado',exact:false}).click()
    assert.equal(await page.locator('#lista-incidencias article').count(),7)
  })
  await check('Contenido de muestra se escapa y títulos largos no desbordan', async () => {
    await ready(page,'reportar.html')
    await fillReport(page, '<img src=x onerror=alert(1)>' + 'X'.repeat(70))
    await page.locator('#modo-demo').check()
    await page.locator('#btn-submit').click()
    await page.locator('#success-detail').click()
    await page.waitForURL('**/detalle.html?id=muestra-*')
    assert.equal(await page.locator('#detalle-contenido img').count(),0)
    assert((await page.locator('h1').textContent()).startsWith('<img'))
    await noOverflow(page)
    await ready(page,'incidencias.html')
    assert.equal(await page.locator('#lista-incidencias img').count(),0)
    await noOverflow(page)
  })
  await check('Error del adaptador real muestra mensaje y reactiva botón (fallo simulado)', async () => {
    await page.route('**/js/folio.js', route => route.fulfill({contentType:'text/javascript',body:'export async function registrarIncidencia(){ throw new Error("Fallo simulado de prueba") }'}))
    await ready(page,'reportar.html')
    await fillReport(page)
    assert(!(await page.locator('#modo-demo').isChecked()))
    await page.locator('#btn-submit').click()
    await page.locator('#error-alert').waitFor({state:'visible'})
    assert.match(await page.locator('#error-alert').textContent(),/Ocurrió un error al guardar/)
    assert(!(await page.locator('#btn-submit').isDisabled()))
    assert(!(await page.locator('#success-alert').isVisible()))
    await page.unroute('**/js/folio.js')
  })
  await check('Cero errores JavaScript sin capturar', async () => assert.deepEqual(errors,[]))
  if (evidence) {
    await mkdir(resolve(root,'docs/pruebas'),{recursive:true})
    await writeFile(resolve(root,'docs/pruebas/resultados-ui.json'),JSON.stringify({fecha:new Date().toISOString(),navegador:`Chromium / Edge ${browser.version()}`,anchos:[320,390,768,1440],pruebas:results,erroresJavaScript:errors,limite:'Sin guardado real en Firebase. El fallo de envío fue simulado para comprobar la interfaz.'},null,2)+'\n')
  }
  console.log(`\n${results.length} comprobaciones correctas.`)
})().catch(error => { console.error(error); process.exitCode = 1 }).finally(async () => {
  if (browser) await browser.close()
  if (server) server.kill()
})
