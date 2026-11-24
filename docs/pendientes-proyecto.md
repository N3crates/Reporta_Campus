# Pendientes de ReportaCampus frente al PDF

Corte: 21 de noviembre de 2026. Rama examinada: `develop` en `633da1d`, más
reorganización en `develop-organizado`. Fuente: guía del alumno, páginas 6-10 y
28-29 (Proyecto 09). No es una calificación ni una certificación del docente.

## Qué existe y qué no demuestra todavía

Existen cuatro pantallas, navegación móvil, validación, ejemplos con filtros e
historial, modelo, historias, semilla, documentación y PR de Revisión 1 integrados.
La transacción de alta/folio está escrita. Sin embargo, la configuración Firebase
conserva placeholders, las reglas niegan todo y las vistas usan mocks. No se puede
afirmar que el flujo real o el CRUD estén terminados por existir esos archivos.

## Revisión 2: jueves 26 de noviembre, 35 puntos

| Pendiente verificable | Responsable | Issue |
|---|---|---|
| Configurar proyecto Firebase real, catálogos y entorno reproducible | C con E | #13 / #15 |
| Login/logout, restauración de sesión y roles reales | E | #15 |
| Reglas Firestore por rol y propiedad, sin apertura global | E con C/D | #15 |
| Sustituir `demo-estudiante` por UID autenticado y comprobar folio real único | D con C/E | #14 / #13 |
| Crear, leer, editar y eliminar incidencias de forma autorizada | C | #13 |
| Demostrar dos escrituras y una lectura, conservadas tras recargar/cerrar | C con B | #13 / #12 |
| Formulario de edición y conexión real de alta/listado/detalle | B | #12 |
| Filtros reales por prioridad, categoría y estado; también ubicación del MVP | C y B | #13 / #12 |
| Transiciones reportado → en_proceso → resuelto con historial atómico | D con E | #14 |
| Guardar fecha y responsable en cada cambio; reflejar el resultado en UI | D y B | #14 / #12 |
| Mensajes de validación, permisos, red, carga, vacío y no encontrado en flujo real | B con C/E | #12 |
| Cálculo real de antigüedad para el enriquecimiento propio de 3 puntos | D | #14 |
| Cinco casos reales documentados como mínimo, incluidos dos negativos | E | #15 |
| Dos PR nuevos de Revisión 2 integrados, con aprobación de otro integrante | A y equipo | #11 |
| README técnico y plantilla `entrega_revision_2.md` con evidencia real | A | #11 |
| Demostración completa: login, alta, recarga, filtros, edición y atención | Todo el equipo | #11-#15 |

La rúbrica distribuye 10 puntos a persistencia/datos, 10 a flujo central, 6 a
validación/permisos, 3 a API o función propia, 3 a pruebas/documentación y 3 a
PR/colaboración. En proyectos sin API se puede acreditar una función real;
no hace falta añadir una integración simulada ni una API ajena al dominio.

### Tu parte B, en concreto

- Conservar la presentación UG y las vistas legibles al conectar servicios reales.
- Conectar el alta al servicio C/D y al usuario E, mostrando el folio real.
- Construir edición con carga previa, guardar/cancelar y campos protegidos.
- Consumir consultas reales para filtros y detalle; los mocks no cuentan como persistencia.
- Integrar historial, controles autorizados de estados y antigüedad de D.
- Mostrar carga, éxito, validación, permiso denegado y fallo de conexión sin perder datos.
- Tomar capturas nuevas y demostrar el recorrido en móvil/escritorio, con PR revisado.

## Revisión 3: jueves 3 de diciembre, 40 puntos

- [ ] Completar todas las funciones del MVP con datos reales; ninguna pantalla crítica basada solo en mocks.
- [ ] Implementar dashboard con conteos por estado y antigüedad de reportes abiertos.
- [ ] Rechazar el cierre sin comentario de resolución y probarlo con permisos reales.
- [ ] Depurar navegación, vista móvil/escritorio, vacíos, carga y errores.
- [ ] Probar seguridad, permisos y límites, incluidas solicitudes manipuladas.
- [ ] Documentar al menos ocho pruebas funcionales, tres negativas/de borde, y correcciones.
- [ ] Entregar README final reproducible, configuración, inicialización de datos y acceso demo seguro.
- [ ] Retirar o aislar la herramienta de carga de semilla antes del release; no dejarla como función pública de producción.
- [ ] Crear `release/1.0.0`, PR a master, sincronizar arreglos a develop y etiquetar `v1.0.0` sobre master.
- [ ] Preparar demostración de 8-10 minutos con participación y explicación de cada integrante.

## Pendientes documentales de la revisión anterior

La evidencia publicada conserva capturas y pruebas de UI. Es necesario completar
los campos faltantes de participación/PR de la plantilla y evitar estados antiguos
de «PR abierto» cuando el merge ya ocurrió. En #8 existe merge, pero no una review
formal APPROVED registrada. No inventar ni retrofechar esa aprobación.

La reorganización actual es una nueva propuesta de cambios: no sustituye la
evidencia que se debía mostrar el 19 ni asegura puntos retroactivos. La guía
indica que cada revisión evalúa lo demostrado en su fecha.

## Orden recomendado

1. Revisar e integrar la rama de organización con el equipo antes de basar nuevos cambios en ella.
2. Acordar contratos de datos/permisos; desbloquear Firebase y Auth con C/E.
3. Completar servicios C y transacciones/antigüedad D; B prepara edición y conexiones.
4. Integrar UI y permisos, probar el flujo real y registrar errores con E.
5. Revisar PR formalmente y completar la entrega/ensayo con A.

Reparto completo: [hito de Revisión 2](https://github.com/N3crates/Reporta_Campus/milestone/1).
