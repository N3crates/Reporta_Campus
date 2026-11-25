# Casos de integración del frontend R2

Entorno: Firebase Authentication y Firestore Emulator local, Edge y SDK web 10.8.0.
El emulador compila las reglas del repositorio; no se sustituyen por permisos abiertos.
Las herramientas Node, Firebase CLI, Playwright y Java están fuera del repositorio.

## Recorrido manual repetible

| Caso | Acción | Resultado esperado |
|---|---|---|
| Acceso positivo | Iniciar sesión con cuenta de prueba válida | Listado y nombre/rol en navegación |
| Acceso negativo | Usar contraseña incorrecta | Mensaje comprensible, botón reactivado |
| Registro negativo | Contraseñas diferentes | Error y foco en confirmación; no se envía |
| Alta negativa | Enviar campos vacíos | Requeridos identificados y foco en título |
| Alta positiva | Completar categoría, edificio, prioridad y descripción | Incidencia, folio e historial inicial juntos |
| Persistencia | Abrir detalle y recargar | Datos recuperados de Firestore |
| Edición | Precargar, cambiar título y guardar | Conserva folio/autor/fecha; muestra cambio al recargar |
| Edición concurrente | Cambiar registro desde otra sesión antes de guardar | Rechazo por conflicto; formulario conservado |
| Filtros | Combinar prioridad, categoría, estado, edificio y texto | Conteo correcto; filtros conservados al recargar |
| Vacío | Combinar filtros sin coincidencias y limpiar | Estado vacío y recuperación del listado |
| Propiedad negativa | Leer/editar un documento de otro reportante | Firestore rechaza la operación |
| Rol negativo | Cambiar el rol propio a admin | Firestore rechaza la operación |
| Estado negativo | Cambiar directamente de reportado a resuelto | Firestore rechaza la operación |
| Datos inmutables | Modificar folio desde un cliente directo | Firestore rechaza la operación |
| Seguimiento | Responsable comenta y avanza en orden | Estado e historial atómicos, UID y fecha del servidor |
| Resolución | Resolver con comentario | Fecha de resolución, sin edición ni nuevo seguimiento |
| No encontrado | Abrir un ID inexistente como personal | Pantalla no encontrado, enlace al listado |
| Salida segura | Nombre con etiquetas HTML en un perfil de prueba | Se muestra como texto, no crea elementos |
| Retiro admin | Confirmar retiro de incidencia | Sale del listado, conserva historial |
| Sesión | Salir y abrir alta | Redirección al login |
| Responsivo | Abrir seis pantallas a 320/390/768/1440 | Sin desbordes; menú abre y cierra con Escape |

La ejecución automatizada guarda cada resultado en `resultados-frontend-r2.json`.
Los rechazos PERMISSION_DENIED de los casos negativos son resultados esperados.
No se reutilizan resultados históricos para declarar esta entrega correcta.

## Preparar el proyecto remoto

Seguir el README. Repetir estos casos después de publicar las reglas y el índice,
con cuentas reales de prueba autorizadas por el equipo. No sustituir las reglas
por `allow read, write: if true` para obtener una demostración exitosa.
