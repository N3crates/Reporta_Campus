# Historias de usuario: ReportaCampus

**Roles:**
- **Reportante:** persona del campus que informa una incidencia.
- **Personal responsable:** atiende y cambia el estado de las incidencias.
- **Administrador:** gestiona catálogos y usuarios.

---

## HU-01: Reportar una incidencia

**Como** reportante,
**quiero** llenar un formulario con título, edificio, aula, categoría y descripción,
**para** que mi problema quede registrado y pueda darle seguimiento.

**Criterios de aceptación**
- [ x ] El formulario tiene los campos: título, edificio, aula, categoría y descripción.
- [ x ] Si algún campo obligatorio está vacío, se muestra un mensaje de error claro y no se guarda nada.
- [ x ] Al enviar un formulario válido, la incidencia se guarda en Firestore con estado inicial `reportado`.
- [ x ] El sistema genera un folio único y se lo muestra al reportante.
- [ x ] Dos reportes enviados casi al mismo tiempo nunca reciben el mismo folio.
- [ x ] El formulario no pide datos sensibles ni la ubicación exacta de la persona.

**Prioridad:** Alta · **Revisión:** 1 · **Módulo:** Formulario y folios

---

## HU-02: Consultar el listado y filtrar incidencias

**Como** usuario del sistema,
**quiero** ver una lista de incidencias y filtrarla por estado, prioridad, categoría y ubicación,
**para** encontrar rápido las que me interesan.

**Criterios de aceptación**
- [ ] El listado muestra folio, título, categoría, edificio, prioridad, estado y fecha.
- [ ] Se puede filtrar por estado, prioridad, categoría y edificio, de forma individual o combinada.
- [ ] Si no hay incidencias o ningún resultado coincide con el filtro, se muestra un mensaje de estado vacío, no una pantalla en blanco.
- [ ] Un reportante ve sus propias incidencias; el personal responsable y el administrador ven todas.
- [ ] La lista se ve bien en móvil y en escritorio.

**Prioridad:** Alta · **Revisión:** 1 (pantalla) y 2 (filtros reales) · **Módulo:** Listado y filtros

---

## HU-03: Ver el detalle de una incidencia con su historial

**Como** usuario del sistema,
**quiero** abrir una incidencia y ver su información completa y sus movimientos,
**para** saber en qué punto está y quién la atendió.

**Criterios de aceptación**
- [ ] El detalle muestra folio, título, descripción, categoría, ubicación, prioridad, estado y fecha de creación.
- [ ] Se muestra el historial de cambios de estado, cada uno con fecha, responsable y comentario.
- [ ] El historial aparece en orden cronológico.
- [ ] Si el folio o el identificador no existe, se muestra un mensaje de "incidencia no encontrada".
- [ ] Un reportante solo puede abrir sus propias incidencias.

**Prioridad:** Alta · **Revisión:** 1 (pantalla) y 2 (historial real) · **Módulo:** Detalle e historial

---

## HU-04: Cambiar el estado de una incidencia

**Como** personal responsable,
**quiero** cambiar el estado de una incidencia (reportado → en proceso → resuelto),
**para** reflejar el avance de la atención.

**Criterios de aceptación**
- [ ] Solo el personal responsable y el administrador pueden cambiar el estado; un reportante no ve la opción y las reglas de Firestore también lo impiden.
- [ ] Las transiciones permitidas son `reportado → en proceso → resuelto`; no se puede saltar ni retroceder.
- [ ] Cada cambio guarda en el historial la fecha, el responsable y el estado anterior y nuevo.
- [ ] No se puede marcar una incidencia como `resuelto` sin un comentario de resolución.
- [ ] Tras el cambio, el listado y el detalle muestran el nuevo estado sin errores.
- [ ] Si falla el guardado, se muestra un mensaje de error y el estado anterior se conserva.

**Prioridad:** Alta · **Revisión:** 2 (cambios e historial) y 3 (regla del comentario) · **Módulo:** Estados y permisos

---

## HU-05: Ver el resumen de incidencias

**Como** personal responsable o administrador,
**quiero** ver un resumen con conteos por estado y la antigüedad de las incidencias,
**para** priorizar la atención y detectar rezagos.

**Criterios de aceptación**
- [ ] El panel muestra cuántas incidencias hay en cada estado: reportado, en proceso y resuelto.
- [ ] Muestra la antigüedad de las incidencias abiertas (por ejemplo, menos de 3 días, de 3 a 7 y más de 7).
- [ ] Las cifras salen de datos reales de Firestore y coinciden con el listado.
- [ ] Si no hay incidencias, el panel muestra ceros y un mensaje de estado vacío.
- [ ] Un reportante no puede acceder al panel.

**Prioridad:** Media · **Revisión:** 3 · **Módulo:** Dashboard