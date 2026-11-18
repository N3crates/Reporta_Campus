# Seguridad y pruebas: revisión 1

**Proyecto:** ReportaCampus · **Responsable:** David Zapien Sabedra (`davidzapiens`)
**Fecha de revisión:** jueves 19 de noviembre de 2026
**Issue:** [#5](https://github.com/N3crates/Reporta_Campus/issues/5)
**Rama:** `feature/docs-estados` → `develop`
**Estado:** preparación local; PR, revisión de otro integrante y fusión pendientes.

## Reglas iniciales

[`firestore.rules`](../firestore.rules) contiene una base cerrada con Rules v2:
rechaza todas las lecturas y escrituras realizadas desde el SDK de cliente,
incluyendo subcolecciones. No contiene una apertura general de la base.

Es una configuración inicial, no las reglas completas del MVP. Al publicarla,
el formulario real y cualquier cargador de datos desde el navegador recibirían
un error de permisos. El modo **Probar sin enviar**, el listado y el detalle de
muestra siguen usando datos locales y no dependen de esas reglas.

El archivo se prepara en esta rama; no se han cambiado reglas en Firebase Console.
No se ha ejecutado el emulador para compilar o probar estas reglas: el entorno
local no tiene un runtime de Java disponible. La prueba de rechazo real queda
pendiente antes de su publicación.

## Integración pendiente con Firebase

Según el README, el login y los roles corresponden a la Revisión 2. Antes de
permitir operaciones reales, el equipo debe integrar y probar lo siguiente:

- Configuración web válida en `public/js/firebase-config.js`.
- Usuario autenticado y uso de su UID en lugar de `demo-estudiante` en `folio.js`.
- Perfiles y roles protegidos: un usuario no puede asignarse `responsable` o `admin`.
- Lectura de incidencias propias para reportantes; lectura de todas para personal autorizado.
- Validación de campos, catálogos, estado inicial y prioridad al crear incidencias.
- Contador y creación de incidencia en una transacción, sin permitir reiniciar
  el contador ni reutilizar folios desde un cliente manipulado.
- Cambios de estado, responsable, fechas e historial en una operación atómica,
  respetando las transiciones de [estados y prioridades](estados_prioridades.md).
- Administración de catálogos y roles reservada a `admin`.
- Pruebas de permisos positivos y negativos en el emulador, sin datos personales reales.

No se debe resolver el bloqueo del envío con reglas abiertas. La transacción
escrita en el cliente necesita reglas que también rechacen solicitudes alteradas.
La prueba T-01 permanece pendiente hasta que el guardado real se pueda verificar.

## Plan de pruebas T-01 a T-03

| ID | Pasos | Resultado esperado | Evidencia que se debe conservar |
|---|---|---|---|
| T-01 | Con Firebase y permisos configurados, desactivar «Probar sin enviar», completar los cinco campos con datos ficticios y enviar. Repetir con dos envíos concurrentes desde pestañas diferentes | Incidencias persistidas con estado `reportado`, prioridad `media`, UID real y folios distintos. Al recargar, los documentos siguen en Firestore | Captura de la confirmación y de los documentos/contador, sin credenciales ni datos personales |
| T-02 | Abrir `reportar.html` y enviar los campos vacíos. Probar también título de más de 100 caracteres y descripción de más de 500 mediante un cliente de prueba | Error claro, sin folio ni escritura. Un rechazo no debe dejar el botón bloqueado | Captura de validación y resultado de prueba; probar límites también en la capa de datos al integrarla |
| T-03 | Abrir inicio, reporte, listado y detalle a 320, 390, 768 y 1440 px. Usar menú móvil, enlaces, filtros y un detalle inexistente | Navegación utilizable, sin desplazamiento horizontal, con mensajes de estado vacío y no encontrado | Capturas y registro de comprobaciones de navegador |

La [plantilla de entrega](entrega_revision_1.md) conserva los resultados de T-02
y T-03 aportados por frontend. Esas evidencias son de Juan Manuel; no se presentan
como una nueva ejecución de David. El modo de muestra no acredita T-01.

## Revisión de Pull Requests

El issue #5 pide revisar al menos un PR de otro integrante y dejar comentarios.
La revisión debe comprobar el código y las evidencias antes de aprobarse.

Para el [PR #9 de datos semilla](https://github.com/N3crates/Reporta_Campus/pull/9),
comprobar los campos contra `modelo-datos.md`, estados, prioridades, historiales,
contador y folios; además, revisar cómo se autoriza la carga desde el navegador.
Ese PR es independiente de los seis ejemplos locales del frontend.

Esta lista es una guía de revisión; no constituye un comentario ni una aprobación
publicada en GitHub. La revisión externa de esta rama también sigue pendiente.
