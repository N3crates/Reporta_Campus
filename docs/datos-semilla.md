# Datos semilla: ReportaCampus

Datos **ficticios** para demostrar la aplicación. Coinciden con los nombres de campo de `docs/modelo-datos.md`.

## Contenido (28 documentos)

| Colección | Documentos |
|---|---|
| `categorias` | 5 (`iluminacion`, `computo`, `limpieza`, `mantenimiento`, `mobiliario`) |
| `edificios` | 4 (`edificio-a`, `edificio-b`, `biblioteca`, `lab-computo`), cada uno con su arreglo `aulas` |
| `incidencias` | 6 (`seed-001` a `seed-006`): 2 reportadas, 2 en proceso, 2 resueltas |
| `incidencias/{id}/historial_estados` | 11, uno por cada cambio de estado |
| `contadores` | `folios-2026` con `ultimoFolio: 6`, para que el siguiente folio real sea `RC-2026-0007` |

Los IDs son fijos, así que cargar la semilla dos veces no duplica datos. El contador solo se crea si no existe.

## Usuarios

No se cargan en la semilla: el ID de `usuarios/{uid}` es el UID de Firebase Authentication, que solo existe al crear la cuenta. Mientras no haya inicio de sesión (Revisión 2), las incidencias usan los marcadores `demo-estudiante` y `demo-responsable`.

Usuarios demo previstos para la Revisión 2 (crearlos en Authentication y luego su documento en `usuarios`):

| Correo | Rol |
|---|---|
| `admin@demo.test` | `admin` |
| `responsable@demo.test` | `responsable` |
| `reportante@demo.test` | `reportante` |

## Cómo cargarla

1. Configurar `public/js/firebase-config.js` con el proyecto del equipo.
2. Verificar que las reglas de Firestore permitan escribir (durante desarrollo, reglas temporales; ver `firestore.rules`).
3. Iniciar el servidor estático (`npx serve public`) y abrir `http://localhost:3000/seed.html`.
4. Pulsar **Cargar datos semilla**; debe mostrar `Listo: 28 documentos escritos.`
5. Comprobar en Firebase Console que existen las colecciones.

> Eliminar `public/seed.html` y `public/js/seed.js` antes del release `v1.0.0`.
