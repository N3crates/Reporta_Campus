# Organización del código

Rama: `develop-organizado`. Base revisada: `develop`, commit `633da1d`.
Fecha: 21 de noviembre de 2026.

## Referencia de la clase

Fuente local: video «Aplicaciones de Internet - 5Nov26.mp4», duración 1 h 14 min
27 s, facilitado por Juan Manuel. Se revisaron visualmente 24 fotogramas
distribuidos por la grabación y se ampliaron los ejemplos de código. No se
transcribió el audio ni se atribuyen al profesor frases no verificadas.

Observaciones reproducibles:

- 13:29 y 16:35: preparación de datos, validación y condiciones antes de la vista.
- 25:54 a 32:06: filtro dividido en variables con nombres y retorno explícito.
- 44:31 y 47:37: funciones compartidas en un archivo separado.
- 50:43: `src/views/card.php`, `header.php` y `footer.php`; etiquetas HTML
  anidadas, contenido en líneas separadas y sangría visible.
- 63:08 a 69:20: esquema con cada campo y restricción en su propia línea.

El ejemplo es PHP. Se adoptan sus principios de organización y lectura en
JavaScript, sin agregar PHP ni cambiar la variante Firebase permitida por el PDF.

## Aplicación al repositorio

| Responsabilidad | Ubicación |
|---|---|
| Estructura principal de cada pantalla | `public/*.html` |
| Encabezado, pie y vistas de tarjetas/detalle/historial | `public/vistas/*.html` |
| Ayudas de presentación y carga de vistas propias | `public/js/funciones.js` |
| Navegación y menú | `public/js/ui.js` |
| Comportamiento de cada pantalla | `public/js/pages/*.js` |
| Ejemplos locales | `public/js/demo-data.js` |
| Integración Firebase y folios | `firebase-config.js`, `firebase.js`, `folio.js` |
| Datos semilla del equipo | `public/data/seed.json` y herramienta `seed.html` |
| Evidencias y requisitos | `docs/` |

Las vistas comunes se cargan por HTTP. Por eso Live Server es suficiente y no
se debe abrir el proyecto mediante `file://`. No hay un compilador ni un servidor
Node dentro de la entrega.

## Cambios de lectura y seguridad de salida

- Cuatro espacios de sangría; punto y coma y bloques explícitos en JavaScript.
- Reglas CSS y campos de datos separados, sin archivos comprimidos.
- Se quitaron las cadenas gigantes de HTML de los módulos de lista y detalle.
- Las plantillas HTML se clonan y se completan con `textContent`. Un título con
  etiquetas se presenta como texto y no se ejecuta como HTML.
- Los iconos se leen de un SVG compartido con nombres permitidos.
- Se mantienen IDs, rutas de las cuatro páginas, funciones de datos de muestra
  y operación transaccional de folios para reducir conflictos con el trabajo R2.
- Se mantienen las reglas cerradas: reorganizar no significa habilitar permisos.

## Archivos retirados

| Archivo | Motivo |
|---|---|
| `package.json` y `package-lock.json` | Paquetes de pruebas, ajenos a la ejecución estática de la entrega solicitada |
| `scripts/serve.mjs` | Servidor Node innecesario; Live Server sirve la aplicación |
| `tests/ui.cjs` y `tests/datos-muestra.cjs` | Herramientas externas de desarrollo; preservadas fuera del repo para verificar el cambio |
| `public/dashboard.html` | Vacío; dashboard todavía pendiente para Revisión 3 |
| `public/logica.html` | Vacío, sin enlaces ni comportamiento |
| `public/js/auth.js` | Vacío; E debe crear la implementación real, no un marcador |
| `public/js/incidencias.js` | Vacío; C debe crear la capa de datos real |

El directorio local `node_modules` se movió fuera del checkout. No estaba
versionado. Las evidencias, la semilla útil y el trabajo funcional de los
compañeros se conservaron. Git conserva las versiones anteriores de lo retirado.

## Pendientes que esta limpieza no completa

No se implementaron CRUD, login, reglas por rol, edición, estados reales ni
dashboard. Esos trabajos conservan el reparto R2 de los issues #11 a #15.
Ver [pendientes contra el PDF](pendientes-proyecto.md) y
[auditoría de archivos](auditoria-archivos.md).

## Verificación ejecutada

Se ejecutaron desde herramientas externas al checkout: 28 comprobaciones UI,
cuatro casos de datos de muestra, revisión de sintaxis de todos los módulos,
validación de JSON/SVG y 95 referencias locales. Resultado: correctos, sin
errores JavaScript sin capturar ni referencias rotas. Se conservaron las pruebas
de 320, 390, 768 y 1440 px y el escape de títulos con etiquetas/texto largo.

Se comprobó además que folios, conexión, configuración y datos de muestra
conservan el mismo código al normalizar el formato, y que la semilla JSON
conserva su contenido. Esto no verifica operaciones de Firebase en vivo.
