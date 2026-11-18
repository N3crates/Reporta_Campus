# Plantilla de entrega: Revisión 1

**Proyecto:** 09 — ReportaCampus
**Equipo e integrantes:** Nestor Isaac Hernandez Duran (Git/docs), Juan Manuel Razo Gayosso (Frontend), Javier Guillermo Cú Rangel (Firestore), Juan Carlos Zuñiga Alfaro (Lógica), David Zapien Sabedra (Seguridad/QA)
**Revisión / fecha:** Revisión 1 — jueves 19 de noviembre de 2026
**Repositorio GitHub:** https://github.com/N3crates/Reporta_Campus
**Rama de integración:** develop
**URL de demostración:** Ejecución local (`npm start`, http://127.0.0.1:4173)

## 1. Objetivo de esta entrega
Dejar una base navegable y responsiva de ReportaCampus: documentación inicial,
historias de usuario, modelo de datos, flujo Git establecido y una primera
funcionalidad real (formulario validado que genera un folio de incidencia).

## 2. Funcionalidades implementadas

| Historia/Issue | Qué hace | Responsable | Rama feature | PR | Estado |
|---|---|---|---|---|---|
| Estructura | Repo, ramas, README, carpetas y documentación | [A] | feature/estructura-inicial | #[ ] | Integrado |
| HU-01 | Formulario validado que genera folio | [D] | feature/formulario-reporte | #[ ] | [ ] |
| HU-02 | Listado responsivo con búsqueda y filtros de muestra | Juan Manuel Razo Gayosso | feature/pantallas-ui | Pendiente de registrar | Implementado; revisión/fusión pendientes |
| HU-03 | Detalle e historial de muestra | Juan Manuel Razo Gayosso | feature/pantallas-ui | Pendiente de registrar | Implementado; revisión/fusión pendientes |
| Modelo | Colecciones de Firestore documentadas | [C] | feature/modelo-datos | #[ ] | [ ] |
| Estados | Diagrama de estados y prioridades | [E] | feature/docs-estados | #[ ] | [ ] |

## 3. Instrucciones para ejecutar (paso a paso)
1. **Requisitos:** navegador moderno, Git, VS Code con la extensión Live Server (o Node.js para `npx serve`).
2. **Clonar:** `git clone https://github.com/N3crates/Reporta_Campus.git`, `cd Reporta_Campus` y seleccionar la rama que se va a demostrar.
3. **Configuración:** para el envío real, completar `public/js/firebase-config.js` con la configuración web del proyecto Firebase del equipo (sin cuentas de servicio ni secretos). Para explorar las pantallas y usar «Probar sin enviar» no se necesita configurar Firebase.
4. **Firebase:** crear el proyecto en Firebase Console, registrar la app web, activar Firestore y Authentication. Publicar las reglas de `firestore.rules`.
5. **Ejecutar:** correr `npm start` y abrir http://127.0.0.1:4173; también se puede usar Live Server o `npx serve public`.
6. **Credenciales demo:** [pendiente hasta que E implemente el login; en la Revisión 1 no aplica].

## 4. Modelo de datos y cambios en esta revisión
Modelo preliminar (detalle en `docs/modelo-datos.md`):

| Colección | Campos principales |
|---|---|
| categorias | nombre, descripcion |
| edificios | nombre, aulas |
| incidencias | folio, titulo, descripcion, categoriaId, edificioId, aula, prioridad, estado, reportanteId, fechaCreacion |
| incidencias/{id}/historial_estados | estadoAnterior, estadoNuevo, responsableId, comentario, fecha |
| usuarios | nombre, correo, rol (reportante / responsable / admin) |
| contadores | ultimoFolio (para generar folios únicos) |

Cambios en esta revisión: modelo creado desde cero.

## 5. Evidencia de pruebas

| ID | Acción | Resultado esperado | Resultado obtenido | Evidencia | Estado |
|---|---|---|---|---|---|
| T-01 | Enviar el formulario completo al sistema real | Se guarda y muestra un folio | Pendiente de configuración Firebase. La simulación de UI no acredita este caso | — | Pendiente |
| T-02 | Enviar el formulario vacío | Mensaje de error, no se genera folio | Cinco campos obligatorios indicados; no se carga el adaptador de guardado | [Captura](capturas/revision-1/formulario-validacion.png) | Correcto en UI |
| T-03 | Abrir la app en móvil y en escritorio | Navegación responsiva sin desbordes | Cuatro páginas comprobadas a 320, 390, 768 y 1440 px; menú móvil y enlaces correctos | [Capturas](capturas/revision-1/README.md), [28 comprobaciones](pruebas/resultados-ui.json) | Correcto |

## 6. GitHub: enlaces de commits, PR, issues y release
- Repositorio: https://github.com/N3crates/Reporta_Campus
- Ramas: master, develop, feature/estructura-inicial, [otras]
- Pull Requests: [#1 URL], [#2 URL], ...
- Issues (backlog): https://github.com/N3crates/Reporta_Campus/issues
- Release: no aplica en esta revisión.

## 7. Problemas conocidos, pendientes y riesgos
- El login y los roles se implementan en la Revisión 2.
- El archivo local `firestore.rules` está vacío y la configuración web contiene valores de ejemplo; el equipo debe completar y verificar ambos antes de acreditar el guardado real.
- [Agregar lo que surja durante la semana.]

## 8. Participación por integrante

| Integrante | Tarea | Commit/PR | Evidencia |
|---|---|---|---|
| Nestor Isaac Hernandez Duran | Repo, README, historias, issues | [enlace] | [enlace] |
| Juan Manuel Razo Gayosso | Cuatro pantallas, navegación, bocetos, capturas y pruebas de UI | feature/pantallas-ui; PR pendiente de registrar | [Entrega frontend](frontend-revision-1.md), [capturas](capturas/revision-1/README.md) |
| Javier Guillermo Cú Rangel | Modelo de datos en Firestore | [enlace] | [documento] |
| Juan Carlos Zuñiga Alfaro | Formulario y generación de folio | [enlace] | [demo] |
| David Zapien Sabedra | Diagrama de estados y revisión de PR | [enlace] | [documento] |

## 9. Guion de demostración (Revisión 1)
1. Nestor Isaac Hernandez Duran: Presenta el repo, las ramas, el README y las historias de usuario.
2. Juan Manuel Razo Gayosso: Muestra las pantallas y la navegación responsiva.
3. Javier Guillermo Cú Rangel: Explica el modelo de datos.
4. Juan Carlos Zuñiga Alfaro: Demuestra en vivo el formulario y el folio generado.
5. David Zapien Sabedra: Muestra el diagrama de estados y un PR revisado.
## Evidencia de frontend incorporada

Ver [entrega de Juan Manuel](frontend-revision-1.md). Los espacios pendientes de otras áreas se conservan para que cada responsable registre sus resultados reales.
