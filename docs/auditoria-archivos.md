# Auditoría completa de archivos

Base: `633da1d`, rama develop. Revisión del 21 de noviembre de 2026.
Se inventariaron los 61 archivos versionados: textos leídos, JSON analizado,
SVG validado como XML e imágenes comprobadas como archivos legibles. Los tamaños
de la tabla corresponden al estado anterior a la reorganización.

No se incorporaron el video de clase, librerías de verificación ni archivos de
la presentación local. El checkout queda separado de las herramientas externas.

| Archivo anterior | Bytes | Decisión |
|---|---:|---|
| `.gitignore` | 82 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `README.md` | 9554 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/bocetos/pantallas-r1.png` | 87143 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/bocetos/pantallas-r1.svg` | 9035 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/capturas/revision-1/README.md` | 1574 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/capturas/revision-1/detalle-escritorio.png` | 154677 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/detalle-movil.png` | 136249 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/detalle-no-encontrado.png` | 71649 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/formulario-demostracion.png` | 169196 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/formulario-validacion.png` | 164536 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/incidencias-escritorio.png` | 172732 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/incidencias-movil.png` | 183890 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/inicio-escritorio.png` | 234360 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/inicio-movil.png` | 184468 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/listado-sin-resultados.png` | 108476 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/menu-movil-abierto.png` | 187404 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/reportar-escritorio.png` | 176895 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/capturas/revision-1/reportar-movil.png` | 153274 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/datos-semilla.md` | 1902 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/entrega_revision_1.md` | 7413 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/estados_prioridades.md` | 6440 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/frontend-revision-1.md` | 6511 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/historias-usuario.md` | 4620 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/modelo-datos.md` | 5944 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/pruebas/resultados-datos-muestra.tap` | 998 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/pruebas/resultados-ui.json` | 3270 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `docs/referencias-diseno-ug.md` | 2553 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `docs/seguridad-revision-1.md` | 5914 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `firestore.rules` | 576 | Conservado cerrado; permisos funcionales pendientes de E. |
| `package-lock.json` | 1737 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `package.json` | 429 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `public/assets/README.md` | 1289 | Conservado; contenido y referencias revisados/actualizados según su función. |
| `public/assets/abeja.svg` | 649 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/assets/campus-linea.svg` | 819 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/assets/escudo-ug-horizontal.png` | 4953 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `public/assets/escudo-ug.png` | 6605 | Conservado: evidencia histórica o imagen institucional; no falsear como prueba nueva. |
| `public/assets/favicon.svg` | 753 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/assets/panal.svg` | 278 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/css/styles.css` | 8325 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/dashboard.html` | 0 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `public/data/seed.json` | 8978 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/detalle.html` | 4821 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/incidencias.html` | 8011 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/index.html` | 8919 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/js/auth.js` | 0 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `public/js/demo-data.js` | 5284 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/js/firebase-config.js` | 329 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/js/firebase.js` | 401 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/js/folio.js` | 1890 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/js/incidencias.js` | 0 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `public/js/pages/detalle.js` | 4336 | Reorganizado: comportamiento por página, sin cadenas HTML gigantes. |
| `public/js/pages/incidencias.js` | 3147 | Reorganizado: comportamiento por página, sin cadenas HTML gigantes. |
| `public/js/pages/reportar.js` | 4781 | Reorganizado: comportamiento por página, sin cadenas HTML gigantes. |
| `public/js/seed.js` | 2550 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/js/ui.js` | 2409 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/logica.html` | 0 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `public/reportar.html` | 10182 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `public/seed.html` | 925 | Conservado y formateado; vistas repetidas separadas cuando corresponde. |
| `scripts/serve.mjs` | 1177 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `tests/datos-muestra.cjs` | 3650 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |
| `tests/ui.cjs` | 10680 | Retirado: herramienta de desarrollo o marcador vacío; ver organización. |

## Archivos nuevos con una función concreta

- `AGENTS.md`: convención de estilo para próximos cambios de Codex en este repo.
- `public/js/funciones.js`: funciones compartidas de presentación.
- `public/vistas/encabezado.html` y `pie.html`: estructura común de las páginas.
- `public/vistas/tarjeta-incidencia.html`: estructura de una tarjeta.
- `public/vistas/detalle-incidencia.html`: campos del detalle.
- `public/vistas/movimiento-historial.html`: una entrada del historial.
- `public/vistas/no-encontrado.html`: mensaje y salida cuando no existe el ejemplo.
- `public/assets/iconos.svg`: iconos reutilizados sin repetir cadenas SVG en JavaScript.
- Documentos de organización, pendientes y pruebas manuales: explicación y trazabilidad.

La validación de enlaces, sintaxis y navegación queda registrada tras ejecutar
las comprobaciones en `docs/pruebas/resultados-organizacion.json`.
