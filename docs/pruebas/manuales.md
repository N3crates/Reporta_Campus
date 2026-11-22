# Pruebas manuales de la interfaz

Ejecutar `public/index.html` con Live Server. El sitio utiliza módulos y carga
vistas HTML propias por HTTP; no necesita instalar paquetes.

| Caso | Acción | Resultado esperado |
|---|---|---|
| M-01 | Abrir Inicio, Reportar, Incidencias y un detalle | Encabezado, pie y contenido cargan; enlaces correctos |
| M-02 | Reducir ventana a 320 y 390 px, abrir Menú y pulsar Escape | El menú abre/cierra y el foco vuelve al botón |
| M-03 | Revisar las cuatro páginas a 320, 390, 768 y 1440 px | Sin desbordamiento horizontal |
| M-04 | Enviar formulario vacío | Cinco mensajes de campos obligatorios; no se envía nada |
| M-05 | Completar campos ficticios y activar Probar sin enviar | Folio DEMO, confirmación y enlace al detalle |
| M-06 | Abrir el detalle recién creado y regresar al listado | La incidencia de muestra coincide y aparece en esa pestaña |
| M-07 | Combinar estado, prioridad, categoría y edificio | Solo aparecen ejemplos coincidentes |
| M-08 | Buscar un texto sin coincidencias y limpiar | Mensaje vacío y recuperación de la lista |
| M-09 | Abrir detalle con ID inexistente | Incidencia no encontrada y enlace de regreso |
| M-10 | Crear en muestra un título con etiquetas y texto largo | Se muestra literalmente, no ejecuta HTML ni desborda |
| M-11 | Abrir una incidencia resuelta de ejemplo | Historial cronológico y comentario de solución visibles |

Registrar fecha, navegador, ancho, resultado obtenido y captura. Este plan no
equivale por sí solo a una ejecución. Los resultados de reorganización, cuando
se hayan ejecutado, quedan en `resultados-organizacion.json`.

Estas comprobaciones son de interfaz y muestras. Para Revisión 2 faltan pruebas
reales de persistencia, permisos, concurrencia e historial en Firestore, conforme
al issue #15. No sustituirlas por resultados de una simulación.
