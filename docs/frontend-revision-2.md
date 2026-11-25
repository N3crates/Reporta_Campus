# Frontend — Revisión 2

Responsable B: Juan Manuel Razo Gayosso (@Juan117RG). Corte: 24 de noviembre de 2026.
Historias HU-01, HU-02 y HU-03; integración de HU-04. Issue #12.
Rama: `feature/r2-ui-formularios-filtros`.

## Entrega implementada

| Tarea B | Implementación |
|---|---|
| Alta y folio real | `reportar.html`, formulario compartido y `folio.js` |
| Edición por ID | `editar.html?id=...`, `pages/editar.js`; precarga, cancelación y guardado |
| Validación y errores | Requeridos; título 100, descripción 500, aula 100; foco y aria-invalid |
| Datos protegidos | Folio, autor, fecha y estado no forman parte del payload de edición |
| Filtros y búsqueda | Texto sin acentos en título/folio; prioridad, categoría, estado y edificio combinables |
| Detalle e historial | Lecturas Firestore, historial ordenado, error de historial diferenciado del vacío |
| Sesión y roles | Login/logout de E; navegación y acciones según usuario autenticado |
| Seguimiento | Usa `cambiarEstado` de D; transacción, UID, fecha del servidor y comentario |
| Antigüedad | Función compartida `antiguedad.js`: días completos y rangos 0–2, 3–7 y 8+ |
| Retiro | Servicio C ampliado con retiro lógico, exclusivo de admin y con confirmación |
| Evitar pérdida y duplicados | Botón deshabilitado durante petición; error conserva campos; control de versión |
| Evidencia | Capturas a 390/1440 px y comprobaciones a 320/390/768/1440 px |

El recorrido principal ya no utiliza `demo-data.js` ni el checkbox «Probar sin enviar».
El material R1 permanece en sus evidencias históricas; develop retiró el módulo de muestras.
No se presenta como
persistencia real de esta revisión.

## Contratos de integración

- `usuarioActual()`: devuelve perfil con `uid`, `email` y `rol`, o null.
  Los errores de lectura del perfil no se convierten silenciosamente en «sin sesión».
- `registrarIncidencia(datos)`: devuelve `{ id, folio }`. Usa UID de Auth y conserva
  la transacción incidencia/contador/historial del equipo.
- `obtenerIncidencias(filtros)`: consulta de develop, ordenada y con filtros Firestore;
  reportante limitado por `reportanteId`;
  personal ve el conjunto. Las vistas excluyen retiradas.
- `obtenerIncidencia(id)`: devuelve documento o null; fechas ISO, historial ordenado
  y `errorHistorial` si falla la subconsulta.
- `actualizarIncidencia(id, datos, fechaActualizacion)`: valida, comprueba permisos
  y versión dentro de una transacción y modifica únicamente campos editables.
  Esta variante de edición completa está en `incidencias-ui.js`; se conserva
  la función de actualización parcial del servicio `incidencias.js` de develop.
- `eliminarIncidencia(id, fechaActualizacion)`: retiro lógico en transacción, no
  borrado físico; conserva la subcolección de historial.
- `cambiarEstado(id, estado, comentario, uid)`: reutiliza la transacción de D.
  El UID enviado debe coincidir con Auth. No hay actualizaciones independientes
  de estado e historial en la interfaz.

Los límites de autorización se aplican también en las reglas; ocultar botones
solo mejora la interfaz. Edición permitida para el propietario mientras está
reportado y para personal mientras no esté resuelto. El retiro solo es de admin.

## Cambios necesarios en la dependencia de autenticación

Se incorporó develop en `d75778c`, con autenticación #19 y catálogos/datos #21 ya integrados.
Los servicios de catálogos y consultas proceden de develop; los adaptadores de
presentación y edición se separaron en `catalogos-ui.js` e `incidencias-ui.js`.
Se resolvió el conflicto de folio conservando el historial inicial del PR #17.
Se corrigieron el import HTTP y el registro de contraseñas en consola. Las nuevas
vistas de sesión/tabla evitan interpolar nombres y correos en HTML. El registro
revierte la cuenta recién creada si no se puede guardar su perfil.

Las reglas propuestas tenían errores de sintaxis y no correspondían a la ruta de
historial. Se corrigieron y se ubicaron en la raíz junto con el índice y
`firebase.json`. El historial nuevo se vincula mediante `ultimoMovimientoId`,
para que las reglas puedan exigir su creación atómica con el cambio de estado.
David y Javier deben revisar estos contratos y reglas antes de integrar.

## Pruebas y evidencia

Resultado: **44 comprobaciones de integración y 6 pruebas de límites correctas**,
sin errores JavaScript del navegador. También se verificaron la sintaxis de 24
módulos y 69 referencias locales, sin enlaces rotos. Los límites de título,
descripción y los rangos de antigüedad tienen resultados independientes en
`pruebas/resultados-dominio-r2.tap`.

Ver `pruebas/resultados-frontend-r2.json`, `pruebas/casos-frontend-r2.md` y
`capturas/revision-2/`. Se utilizan Firebase Authentication y Firestore Emulator,
con los SDK reales y cuentas ficticias de prueba. No se escribieron datos ni se
publicaron reglas en el proyecto Firebase remoto.

Las capturas muestran la aplicación real conectada al emulador. Las cuentas y
reportes pertenecen exclusivamente a ese entorno; no son evidencia de producción.
Los resultados R1 y organización del 21 de noviembre conservan su fecha y alcance.

## Comprobación pendiente del equipo

1. Revisar formalmente este PR por otra persona; integrar en develop.
2. Con la cuenta autorizada, publicar reglas/índice y confirmar Email/Password,
   dominio, perfiles reales y catálogos del proyecto remoto.
3. Repetir login → alta → recarga → filtros → edición → seguimiento con cuentas
   de los tres roles en ese entorno y adjuntar evidencia de integración.
4. A completa la plantilla de entrega y comprueba los dos PR nuevos requeridos.

No se marca como cumplida la revisión humana, la fusión ni la verificación remota
por haber terminado la implementación y sus pruebas locales.
