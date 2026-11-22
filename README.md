# ReportaCampus

Mesa de ayuda para registrar y dar seguimiento a problemas de mantenimiento,
iluminación, cómputo, mobiliario y limpieza de las instalaciones universitarias.
Proyecto 09 de Aplicaciones de Internet 2026.

## Problema y objetivo

Los reportes llegan por canales diferentes y se pierde su seguimiento. El objetivo
es reunirlos en una aplicación con folio, ubicación, prioridad, estado e historial
de atención hasta su resolución.

## Tecnologías y alcance

- HTML5 y vistas HTML reutilizables.
- Tailwind CSS por CDN, para desarrollo, y Google Fonts (Raleway).
- JavaScript sin frameworks, organizado en módulos.
- Firebase Authentication y Firestore como integración prevista; todavía pendiente
  de configuración y permisos funcionales en el código actual.

El PDF permite la variante JavaScript + Firebase. El video de referencia usa
PHP; en esta rama se adopta su organización legible, sin cambiar de backend.
La aplicación no necesita instalar paquetes ni ejecutar npm.

Fuera de alcance: denuncias personales, emergencias y ubicación exacta de personas.

## Cómo ejecutar

1. Clonar el repositorio y seleccionar esta rama:

   ```text
   git clone https://github.com/N3crates/Reporta_Campus.git
   cd Reporta_Campus
   git switch develop-organizado
   ```

2. Abrir la carpeta en Visual Studio Code.
3. Con la extensión Live Server ya instalada, hacer clic derecho en
   `public/index.html` y elegir **Open with Live Server**.
4. Usar la dirección que abra Live Server. Si se sirve la raíz del repositorio,
   la dirección incluye `/public/index.html`.

Como alternativa, si ya se tiene Python instalado, se puede servir `public` con
`python -m http.server 5500 --directory public` y abrir http://localhost:5500.
Es un servidor de archivos para desarrollo, no un backend nuevo de la aplicación.

Se necesita Internet para Tailwind y Google Fonts. No abrir el sitio mediante
`file://`: los módulos y las vistas compartidas necesitan un servidor HTTP.

## Estructura

```text
Reporta_Campus/
    public/
        index.html
        reportar.html
        incidencias.html
        detalle.html
        seed.html                 Herramienta de desarrollo para el equipo
        assets/                   Escudos, ilustraciones e iconos SVG
        css/styles.css            Identidad y estilos compartidos
        data/seed.json            Semilla ficticia de Firestore
        vistas/                   Encabezado, pie, tarjeta, detalle e historial
        js/
            funciones.js          Funciones de presentación
            ui.js                 Vistas comunes y menú responsivo
            demo-data.js          Ejemplos locales de Revisión 1
            firebase-config.js    Configuración web, actualmente de ejemplo
            firebase.js           Conexión con Firestore
            folio.js              Transacción de alta y folio del equipo
            seed.js               Carga controlada de semilla
            pages/                Comportamiento de reporte, lista y detalle
    docs/                         Modelo, historias, evidencia y organización
    firestore.rules               Reglas iniciales cerradas
    AGENTS.md                     Convenciones de código para siguientes cambios
    README.md
```

## Qué funciona actualmente

- Inicio, formulario, listado y detalle enlazados con diseño inspirado en la UG.
- Menú móvil con apertura/cierre y navegación accesible.
- Validación de campos y mensajes del formulario.
- Búsqueda y filtros combinados sobre seis ejemplos locales.
- Detalle con historial ficticio, lista vacía y caso no encontrado.
- Opción **Probar sin enviar**: crea un folio `DEMO-...` para explorar la interfaz
  en la pestaña actual. No guarda una incidencia real ni acredita persistencia.

La lógica transaccional de `folio.js` existe, pero su ejecución real no está
verificada con la configuración actual. No se presenta como CRUD terminado.

## Integración Firebase pendiente

1. Completar la configuración web de `public/js/firebase-config.js` con C.
2. Activar Authentication y crear usuarios de prueba con E.
3. Implementar y probar reglas por rol; `firestore.rules` actualmente deniega todo.
4. Completar la capa CRUD y las consultas reales con C.
5. Reemplazar `demo-estudiante` por el UID autenticado en el alta con D/E.
6. Conectar las pantallas, los cambios de estado y el historial reales.

No abrir globalmente las reglas para conseguir que el formulario guarde. No subir
contraseñas, cuentas de servicio, tokens privados ni datos personales.

## Equipo y Revisión 2

| Rol | Integrante | Responsabilidad | Issue |
|---|---|---|---|
| A | Nestor Isaac Hernandez Duran | Coordinación y documentación | [#11](https://github.com/N3crates/Reporta_Campus/issues/11) |
| B | Juan Manuel Razo Gayosso | Formularios, filtros y UI | [#12](https://github.com/N3crates/Reporta_Campus/issues/12) |
| C | Javier Guillermo Cú Rangel | Datos, persistencia y CRUD | [#13](https://github.com/N3crates/Reporta_Campus/issues/13) |
| D | Juan Carlos Zuñiga Alfaro | Folios, estados, historial y antigüedad | [#14](https://github.com/N3crates/Reporta_Campus/issues/14) |
| E | David Zapien Sabedra | Authentication, permisos y pruebas | [#15](https://github.com/N3crates/Reporta_Campus/issues/15) |

## Documentación y evidencia

- [Organización y referencia del video](docs/organizacion.md).
- [Auditoría de todos los archivos](docs/auditoria-archivos.md).
- [Lista de pendientes frente al PDF](docs/pendientes-proyecto.md).
- [Guía de pruebas manuales](docs/pruebas/manuales.md).
- [Historias de usuario](docs/historias-usuario.md).
- [Modelo de datos](docs/modelo-datos.md).
- [Estados y prioridades](docs/estados_prioridades.md).
- [Datos semilla](docs/datos-semilla.md).
- [Entrega de Revisión 1](docs/entrega_revision_1.md).
- [Bocetos](docs/bocetos/pantallas-r1.png) y [capturas](docs/capturas/revision-1/README.md).
- [Fuentes del diseño UG](docs/referencias-diseno-ug.md).

Los registros de 28 comprobaciones UI y cuatro pruebas de datos de muestra se
conservan como evidencia histórica. Sus herramientas de automatización se retiraron
de la distribución académica; los resultados no acreditan Firebase ni permisos reales.

## Flujo Git

`master` conserva la versión estable; `develop` integra el trabajo mediante PR.
Las nuevas funcionalidades parten de `develop` actualizada. Esta reorganización
se revisa en `develop-organizado`; no sustituye automáticamente a `develop`.
Para el cierre final: `release/1.0.0` a `master`, sincronización a `develop` y
etiqueta `v1.0.0`, conforme a la guía.
