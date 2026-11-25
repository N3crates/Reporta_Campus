# ReportaCampus

Proyecto 09 de Aplicaciones de Internet 2026. Permite reportar y dar seguimiento
a incidencias de mantenimiento, iluminación, cómputo, limpieza y mobiliario del campus.

## Ejecutar la aplicación

1. Clonar el repositorio y seleccionar la rama de esta entrega:

   ~~~text
   git clone https://github.com/N3crates/Reporta_Campus.git
   cd Reporta_Campus
   git switch feature/r2-ui-formularios-filtros
   ~~~

2. Abrir la carpeta con Visual Studio Code y usar **Open with Live Server** sobre
   `public/index.html`. Si el servidor abre la raíz del repositorio, entrar a
   `/public/index.html`.
3. Se requiere conexión para Tailwind CDN, Google Fonts y los SDK de Firebase.
   La aplicación usa HTML, Tailwind y JavaScript sin frameworks; no requiere npm,
   compilación ni un servidor Node. Abrir archivos mediante HTTP, no con doble clic.

## Firebase del equipo

La configuración web está en `public/js/firebase-config.js`. No contiene claves
privadas de servidor. El acceso a los datos depende de Authentication y las reglas.

- Activar Email/Password en Firebase Authentication y autorizar el dominio de acceso.
- Cada alta crea el perfil `usuarios/{uid}` con rol `reportante`.
- Un administrador del proyecto debe asignar el primer rol `admin` en la consola.
  Los roles permitidos son `reportante`, `responsable` y `admin`.
- Crear los catálogos `categorias` y `edificios` con los IDs/nombres descritos
  en `docs/modelo-datos.md` y `public/data/seed.json`.
- Revisar y publicar las reglas de `firestore.rules` y el índice de
  `firestore.indexes.json` con la cuenta autorizada del equipo. `firebase.json`
  relaciona ambos archivos. Esta entrega no los despliega al proyecto remoto.
- Los índices combinan propietario y filtros de estado, prioridad, categoría y
  edificio con `fechaCreacion DESC`. El personal puede consultar el conjunto
  de incidencias; un reportante consulta las propias.

La semilla y su cargador se conservan como material de desarrollo de R1. No ejecutar
el cargador sobre producción: sus propietarios ficticios no corresponden a cuentas
autenticadas. Las reglas de esta entrega no abren permisos para cargar esos ejemplos.

## Pantallas y comportamiento

- Inicio con conteos de las incidencias disponibles para la sesión.
- Login y registro con identidad UG: azul, amarillo, escudos existentes, Raleway,
  abejas y arquitectura del campus. Validación, confirmación de contraseña y errores.
- Alta con catálogos de Firestore, validación y folio generado por la transacción
  del equipo. El alta escribe incidencia, contador e historial inicial juntos.
- Edición por ID: precarga y cancelación, conservación del folio/autor/fecha,
  rechazo de versiones desactualizadas y campos conservados ante errores.
- Listado y detalle conectados a Firestore; estados de carga, vacío, error,
  permisos y no encontrado. Los filtros combinados se conservan en la URL.
- Seguimiento con la transacción de D, UID autenticado y comentario. Se permite
  reportado → en_proceso → resuelto. Estado e historial se escriben juntos.
- Antigüedad calculada desde fechas reales del documento; se congela al resolver.
- Retiro lógico de incidencias solo para admin y con confirmación. Conserva historial.

Los filtros por prioridad, categoría, estado y edificio se envían al servicio de
Firestore integrado en develop mediante el PR #21. La búsqueda por título/folio
se aplica en el navegador sobre esos resultados autorizados. El archivo de índices
cubre las combinaciones de filtros, con y sin restricción de propietario.
No hay paginación; el volumen previsto es el de la demostración académica.
Los ejemplos locales de R1 no alimentan estas pantallas.

## Organización

~~~text
public/
    index.html, login.html, registro.html
    reportar.html, editar.html, incidencias.html, detalle.html
    admin.html                    Panel aportado en autenticación
    css/styles.css                Identidad visual compartida
    assets/                       Escudos, abejas, panal e iconos
    vistas/                       HTML reutilizable, incluidos los formularios
    js/
        auth.js, firebase.js      Integración de autenticación y datos
        catalogos.js              Servicio de catálogos de develop (PR #21)
        catalogos-ui.js           Opciones y etiquetas para los formularios
        folio.js, estados.js      Transacciones del equipo
        incidencias.js            Servicio y consultas de develop (PR #21)
        incidencias-ui.js         Adaptación de fechas, edición completa y retiro
        formulario-incidencia.js  Control común de alta y edición
        funciones.js, ui.js       Presentación y navegación
        validaciones.js           Validación compartida
        mensajes.js, permisos.js  Mensajes y disponibilidad de acciones
        antiguedad.js             Cálculo compartido, sin datos simulados
        pages/                    Inicialización de cada pantalla
docs/                             Modelo, evidencias y documentación
firestore.rules                   Permisos y validación de escrituras
firestore.indexes.json             Índice para consultas por propietario
firebase.json                     Configuración Firebase; no ejecuta un backend
AGENTS.md                         Convenciones de código de la clase
~~~

Se usan cuatro espacios, punto y coma, bloques explícitos y vistas HTML separadas.
Los datos de usuarios se muestran con `textContent`; `innerHTML` se limita a
cargar vistas HTML estáticas del proyecto.

## Validación y entrega

La evidencia actual está en [frontend R2](docs/frontend-revision-2.md) y
[capturas R2](docs/capturas/revision-2/README.md). Los casos y resultados se
documentan en `docs/pruebas/`.

Las pruebas de esta entrega usan los SDK reales con Firebase Emulator local.
No certifican la configuración, los índices o las reglas desplegadas en el proyecto
remoto. Las herramientas de prueba se mantienen fuera de la entrega académica.

## Equipo y revisión

| Persona | Responsabilidad | Issue |
|---|---|---|
| Néstor Isaac Hernández Durán | A · Integración y documentación | #11 |
| Juan Manuel Razo Gayosso | B · Interfaz, formularios y filtros | #12 |
| Javier Guillermo Cú Rangel | C · Persistencia y CRUD | #13 |
| Juan Carlos Zuñiga Alfaro | D · Estados, historial y antigüedad | #14 |
| David Zapien Sabedra | E · Autenticación y permisos | #15 |

Esta rama incorpora develop con los PR #17, #19 y #21 y adapta la interfaz a sus
servicios. Requiere revisión humana antes de fusionar
en develop. El issue #12 se mantiene abierto hasta comprobar la entrega integrada.

## Diseño

Identidad inspirada en la Universidad de Guanajuato. Escudos y referencias en
`docs/referencias-diseno-ug.md` y `public/assets/README.md`. Proyecto académico,
sin afirmación de ser un servicio institucional oficial.
