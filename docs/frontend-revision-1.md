# Entrega de frontend: revisión 1

**Proyecto:** ReportaCampus · **Responsable:** Juan Manuel Razo Gayosso (`Juan117RG`)
**Fecha de revisión:** jueves 19 de noviembre de 2026
**Issue:** [#2](https://github.com/N3crates/Reporta_Campus/issues/2)
**Rama:** `feature/pantallas-ui` → `develop`
**Pull Request:** [#8: pantallas responsivas y evidencias de frontend](https://github.com/N3crates/Reporta_Campus/pull/8)
**Estado:** PR #8 integrado en develop. GitHub no registra una revisión formal APPROVED para ese PR.

## Qué se entrega

| Pantalla | Implementación |
|---|---|
| `public/index.html` | Inicio, navegación, accesos a reporte/listado, recorrido y ejemplos de estados |
| `public/reportar.html` | Formulario con etiquetas, ayudas, validación, éxito y opción de demostración |
| `public/incidencias.html` | Tarjetas, búsqueda por título/folio y filtros combinados por estado, prioridad, categoría y edificio |
| `public/detalle.html` | Información completa, estado, historial cronológico y regreso al listado |

Todas las pantallas usan la paleta azul, amarillo y dorado inspirada en la UG,
abejas y motivos de panal, Tailwind por CDN, Google Fonts (Raleway),
HTML y módulos JavaScript, sin frameworks de aplicación. La navegación móvil
incluye `aria-expanded`, cierre con Escape y devolución de foco al botón.
Los títulos largos se parten sin provocar desplazamiento horizontal.

## Bocetos y capturas

- [Boceto editable SVG](bocetos/pantallas-r1.svg)
- [Boceto PNG](bocetos/pantallas-r1.png)
- [Índice de las 13 capturas](capturas/revision-1/README.md)
- [Registro de 28 comprobaciones en navegador](pruebas/resultados-ui.json)

Las capturas se tomaron en Edge/Chromium, escritorio a 1440 × 1000 y móvil
a 390 × 844 píxeles, con captura de página completa. También se probaron
320 y 768 píxeles de ancho. Son vistas de navegador con tamaños móviles,
no fotografías de un teléfono físico.

## Ejecutar

Seleccionar la rama que se va a demostrar y abrir `public/index.html` con
Live Server. Usar la URL que indique la extensión. No hace falta instalar
paquetes de la aplicación. Se necesita Internet para Tailwind y Google Fonts.

## Recorrido para presentar tu parte

1. Abrir Inicio y explicar el propósito de la mesa de ayuda.
2. Reducir la ventana a móvil y abrir/cerrar el menú.
3. Entrar a Reportar; enviar vacío y mostrar los mensajes obligatorios.
4. Llenar datos ficticios, activar **Probar sin enviar** y enviar.
5. Mostrar el folio `DEMO-…` y abrir su detalle desde la confirmación.
6. Volver al listado; explicar que ese reporte de prueba está disponible en la misma pestaña.
7. Filtrar los ejemplos por estado, prioridad, categoría y edificio; probar una búsqueda sin coincidencias.
8. Abrir una incidencia resuelta (por ejemplo `demo-001`) para mostrar el historial completo.
9. Mostrar los bocetos, las capturas y el PR dirigido a `develop`.

## Integración con el trabajo de Juan Carlos y Javier

Se conservan los IDs `form-reporte`, `titulo`, `categoriaId`, `edificioId`, `aula`,
`descripcion`, `error-alert`, `success-alert`, `folio-generado` y `btn-submit`.
La función `registrarIncidencia()` y la transacción de `public/js/folio.js`
no se modifican. El envío normal sigue usando esa función, con prioridad `media`.

Se difiere el import de `folio.js` hasta un envío válido para que la validación
y la interfaz puedan funcionar aun sin configurar Firebase. La opción de prueba
es explícita y está desactivada por defecto.

Lista y detalle comparten `public/js/demo-data.js`. Ese módulo es independiente
de la futura capa real `public/js/incidencias.js`; no debe confundirse con ella.
Los estados internos son `reportado`, `en_proceso`, `resuelto`; las prioridades,
`baja`, `media`, `alta`, conforme al modelo del equipo.

Los reportes creados con **Probar sin enviar** usan `sessionStorage` en la pestaña.
No se escriben en Firebase. Los seis ejemplos base son ficticios y cubren todos
los estados y prioridades. Los conteos de Inicio son una ilustración de esos seis
ejemplos, no un dashboard real ni un contador de nuevos reportes de demostración.

## Pruebas y límites

Resultado: **28 comprobaciones correctas**, sin errores JavaScript sin capturar.
Se comprobaron las cuatro pantallas a 320, 390, 768 y 1440 píxeles, los enlaces,
el menú móvil, los filtros, el estado vacío, un detalle inexistente, la validación,
el recorrido de muestra, el escape de texto y un título largo sin espacios.
El manejo de fallo de envío se comprobó mediante un adaptador simulado;
no se intentó guardar en una base real durante las pruebas.

Para repetir el recorrido, seguir la [guía manual](pruebas/manuales.md).
Las herramientas Node/Playwright se retiraron de esta rama académica durante
la reorganización; se conservan los resultados y las capturas originales.

La configuración Firebase del repositorio todavía contiene valores de ejemplo.
El guardado real y la prueba T-01 del equipo siguen pendientes de esa configuración
y de las reglas. Esta entrega no acredita persistencia ni autorización real.
El login, los roles y el dashboard real quedan para las revisiones correspondientes.

## Criterios del issue #2

- [x] Bocetos de las pantallas principales.
- [x] Inicio con navegación.
- [x] Pantallas de reporte, listado y detalle enlazadas.
- [x] Google Fonts y Tailwind por CDN.
- [x] Menú móvil funcional.
- [x] Sin desbordes horizontales en los anchos comprobados.
- [x] Capturas en móvil y escritorio guardadas dentro del repo.
- [ ] Evidencia de aprobación formal de otra persona en GitHub (no consta como APPROVED en #8).
- [x] PR fusionado en `develop` (#8).

La revisión humana y la integración deben registrarse en GitHub; no se sustituyen
con las pruebas automáticas ni con una autoaprobación del autor.


## Actualización visual: Universidad de Guanajuato

Se rediseñaron las cuatro páginas a petición de Juan Manuel: encabezado
institucional, navegación azul con acento amarillo, escudos originales UG,
tipografía Raleway y motivos de colmena. La portada incorpora una abeja y una
ilustración vectorial de arquitectura y escalinata creadas para este proyecto.

Las capturas y los bocetos fueron regenerados para representar este diseño.
La funcionalidad, los IDs del formulario y la transacción del compañero se conservan.
Consultar [investigación visual y fuentes](referencias-diseno-ug.md) y
[procedencia de los recursos](../public/assets/README.md).
