# Plantilla de entrega: Revisión 1

**Proyecto:** 09 — ReportaCampus
**Equipo e integrantes:** [Nombre A] (Git/docs), [Nombre B] (Frontend), [Nombre C] (Firestore), [Nombre D] (Lógica), [Nombre E] (Seguridad/QA)
**Revisión / fecha:** Revisión 1 — jueves 19 de noviembre de 2026
**Repositorio GitHub:** [URL del repo]
**Rama de integración:** develop
**URL de demostración:** [si la hay; si no, "Ejecución local"]

## 1. Objetivo de esta entrega
Dejar una base navegable y responsiva de ReportaCampus: documentación inicial,
historias de usuario, modelo de datos, flujo Git establecido y una primera
funcionalidad real (formulario validado que genera un folio de incidencia).

## 2. Funcionalidades implementadas

| Historia/Issue | Qué hace | Responsable | Rama feature | PR | Estado |
|---|---|---|---|---|---|
| Estructura | Repo, ramas, README, carpetas y documentación | [A] | feature/estructura-inicial | #[ ] | Integrado |
| HU-01 | Formulario validado que genera folio | [D] | feature/formulario-reporte | #[ ] | [ ] |
| HU-02 | Pantalla de listado de incidencias | [B] | feature/pantallas-ui | #[ ] | [ ] |
| HU-03 | Pantalla de detalle de incidencia | [B] | feature/pantallas-ui | #[ ] | [ ] |
| Modelo | Colecciones de Firestore documentadas | [C] | feature/modelo-datos | #[ ] | [ ] |
| Estados | Diagrama de estados y prioridades | [E] | feature/docs-estados | #[ ] | [ ] |

## 3. Instrucciones para ejecutar (paso a paso)
1. **Requisitos:** navegador moderno, Git, VS Code con la extensión Live Server (o Node.js para `npx serve`).
2. **Clonar:** `git clone [URL del repo]` y `cd reportacampus`.
3. **Configuración:** copiar `public/js/firebase-config.example.js` a `firebase-config.js` y pegar los datos del proyecto Firebase del equipo (sin cuentas de servicio ni secretos).
4. **Firebase:** crear el proyecto en Firebase Console, registrar la app web, activar Firestore y Authentication. Publicar las reglas de `firestore.rules`.
5. **Ejecutar:** abrir `public/index.html` con Live Server, o correr `npx serve public`.
6. **Credenciales demo:** [pendiente hasta que E implemente el login; en la Revisión 1 no aplica].

## 4. Modelo de datos y cambios en esta revisión
Modelo preliminar (detalle en `docs/modelo-de-datos.md`):

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
| T-01 | Enviar el formulario completo | Se genera y muestra un folio | [ ] | [captura] | [ ] |
| T-02 | Enviar con título vacío | Mensaje de error, no se genera folio | [ ] | [captura] | [ ] |
| T-03 | Abrir la app en móvil y en escritorio | Navegación responsiva sin desbordes | [ ] | [captura] | [ ] |

## 6. GitHub: enlaces de commits, PR, issues y release
- Repositorio: [URL]
- Ramas: master, develop, feature/estructura-inicial, [otras]
- Pull Requests: [#1 URL], [#2 URL], ...
- Issues (backlog): [URL de la lista de issues]
- Release: no aplica en esta revisión.

## 7. Problemas conocidos, pendientes y riesgos
- El login y los roles se implementan en la Revisión 2.
- Las reglas de Firestore aún son básicas; se endurecen en la Revisión 2.
- [Agregar lo que surja durante la semana.]

## 8. Participación por integrante

| Integrante | Tarea | Commit/PR | Evidencia |
|---|---|---|---|
| Nestor Isaac Hernandez Duran | Repo, README, historias, issues | [enlace] | [enlace] |
| Juan Manuel Razo Gayosso | Bocetos y pantallas responsivas | [enlace] | [capturas] |
| Javier Guillermo Cú Rangel | Modelo de datos en Firestore | [enlace] | [documento] |
| Juan Carlos Zuñiga Alfaro | Formulario y generación de folio | [enlace] | [demo] |
| David Zapien Sabedra | Diagrama de estados y revisión de PR | [enlace] | [documento] |

## 9. Guion de demostración (Revisión 1)
1. Nestor Isaac Hernandez Duran: Presenta el repo, las ramas, el README y las historias de usuario.
2. Juan Manuel Razo Gayosso: Muestra las pantallas y la navegación responsiva.
3. Javier Guillermo Cú Rangel: Explica el modelo de datos.
4. Juan Carlos Zuñiga Alfaro: Demuestra en vivo el formulario y el folio generado.
5. David Zapien Sabedra: Muestra el diagrama de estados y un PR revisado.