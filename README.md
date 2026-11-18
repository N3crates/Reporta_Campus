# ReportaCampus

Mesa de ayuda para registrar, priorizar y dar seguimiento a incidencias en las instalaciones del campus.

> Proyecto final de Aplicaciones de Internet, curso 2026 (Proyecto 09).

## Problema

Los reportes de luminarias, computadoras, limpieza o mantenimiento llegan por canales diferentes y se pierde el seguimiento.

## Objetivo

Registrar y priorizar solicitudes, asignar responsables y visualizar el avance hasta el cierre.

## Alcance del MVP

- Formulario de reporte con título, lugar, categoría y descripción
- Folio único por incidencia
- Listado con filtros por estado, prioridad y ubicación
- Cambio de estado: reportado → en proceso → resuelto
- Historial de movimientos con fecha y responsable
- Resumen (dashboard) de incidencias por estado y antigüedad
- Roles: reportante y personal responsable/administrador

## Fuera de alcance

No se recopilan denuncias personales, ubicaciones exactas de usuarios ni incidentes de emergencia. Es solo para mantenimiento.

## Tecnologías

- HTML5
- Tailwind CSS (CDN, solo para desarrollo)
- Google Fonts
- JavaScript (módulos ES, sin frameworks)
- Firebase: Firestore (datos) y Authentication (usuarios)

## Estructura del proyecto

```
reportacampus/
├── public/          # páginas HTML, CSS y JavaScript
│   ├── css/
│   └── js/
│       ├── firebase-config.js
│       ├── firebase.js
│       ├── auth.js
│       ├── incidencias.js
│       ├── folio.js
│       ├── ui.js
│       └── pages/
├── docs/            # historias de usuario, modelo de datos, estados, entregas
├── firestore.rules  # reglas de seguridad de Firestore
└── README.md
```

## Cómo ejecutar el proyecto

### Requisitos

- Navegador moderno
- Git
- VS Code con la extensión **Live Server**, o Node.js para usar `npx serve`

### Instalación

1. Clonar el repositorio:

       git clone https://github.com/N3crates/Reporta_Campus.git
       cd Reporta_Campus

2. Verificar que `public/js/firebase-config.js` apunte al proyecto Firebase del equipo.
   Estos datos identifican el proyecto y no son secretos; la seguridad depende de las reglas de Firestore.

3. Iniciar un servidor estático. Los módulos de JavaScript no funcionan abriendo el HTML con `file://`.
   - Con Live Server: clic derecho en `public/index.html` → *Open with Live Server*.
   - O con Node.js:

         npx serve public

4. Abrir la URL que indique el servidor (por ejemplo, `http://localhost:3000`).

### Configuración de Firebase (para reproducir en otro proyecto)

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/) y registrar una app web.
2. Activar **Firestore Database** y **Authentication** (método correo/contraseña).
3. Copiar la configuración web de la app en `public/js/firebase-config.js`.
4. Publicar las reglas de `firestore.rules` desde la consola de Firebase (pestaña *Reglas*).
5. Crear los datos iniciales (categorías y edificios) según `docs/modelo-datos.md`.

> **Seguridad:** nunca se debe subir al repositorio una cuenta de servicio, archivos `.env`, contraseñas ni datos personales reales. Las reglas de Firestore no deben usar `allow read, write: if true`.

### Usuarios demo

[Se agregan en la Revisión 2, cuando exista el inicio de sesión.]

## Modelo de datos (resumen)

| Colección | Campos principales |
|---|---|
| `categorias` | nombre, descripcion |
| `edificios` | nombre, aulas |
| `incidencias` | folio, titulo, descripcion, categoriaId, edificioId, aula, prioridad, estado, reportanteId, fechaCreacion |
| `incidencias/{id}/historial_estados` | estadoAnterior, estadoNuevo, responsableId, comentario, fecha |
| `usuarios` | nombre, correo, rol |
| `contadores` | ultimoFolio |

Detalle completo en [`docs/modelo-datos.md`](docs/modelo-datos.md).

## Estados y prioridades

- **Estados:** reportado → en proceso → resuelto
- **Prioridades:** baja, media, alta

Diagrama en [`docs/estados_prioridades.md`](docs/estados_prioridades.md).

## Flujo de trabajo en Git

| Rama | Uso |
|---|---|
| `master` | Versión estable; solo recibe cambios por PR desde `release/*` |
| `develop` | Integración de funcionalidades |
| `feature/*` | Una por funcionalidad; nace de `develop` y regresa por Pull Request |
| `release/1.0.0` | Cierre de la versión; se fusiona a `master` y luego a `develop` |

Para cada funcionalidad:

    git checkout develop
    git pull origin develop
    git checkout -b feature/nombre-funcionalidad
    # programar y probar
    git add .
    git commit -m "feat: descripcion breve"
    git push -u origin feature/nombre-funcionalidad

Después se abre un Pull Request hacia `develop`, con evidencia y revisión de un integrante distinto del autor.

## Documentación

- [Historias de usuario](docs/historias-usuario.md)
- [Modelo de datos](docs/modelo-datos.md)
- [Estados y prioridades](docs/estados_prioridades.md)
- [Entrega de la Revisión 1](docs/entrega_revision_1.md)

## Equipo

| Integrante | Responsabilidad Entrega 1 |
|---|---|
| Nestor Isaac Hernandez Duran | Git, documentación y coordinación |
| Juan Manuel Razo Gayosso | Frontend (Tailwind, responsividad, UX) |
| Javier Guillermo Cú Rangel | Firestore y capa de datos |
| Juan Carlos Zuñiga Alfaro | Lógica de negocio (folios, estados, historial) |
| David Zapien Sabedra | Seguridad, Authentication, reglas y pruebas |

## Estado del proyecto

- [ ] Revisión 1 (19 de noviembre): base navegable, historias, modelo de datos y primera funcionalidad
- [ ] Revisión 2 (26 de noviembre): persistencia, flujo principal, validaciones y pruebas
- [ ] Revisión 3 (3 de diciembre): MVP completo, release `v1.0.0` y demo

## Interfaz de la revisión 1 (Juan Manuel Razo Gayosso)

Las pantallas `public/index.html`, `reportar.html`, `incidencias.html` y `detalle.html`
están enlazadas y usan Tailwind por CDN, Raleway y navegación móvil.
El listado y el detalle muestran incidencias ficticias de `public/js/demo-data.js`.
Los filtros combinados funcionan sobre esos ejemplos; todavía no consultan Firestore.

### Probar la interfaz sin configurar Firebase

Con Node.js, ejecutar `npm start` y abrir `http://127.0.0.1:4173`.
No hace falta instalar dependencias para iniciar este servidor estático.
También se puede usar Live Server, como se indica arriba.
Se necesita Internet para Tailwind y Google Fonts.

En el formulario, activar **Probar sin enviar** para generar un folio con prefijo
`DEMO-`, abrir su detalle y encontrarlo en el listado de esa misma pestaña.
Este modo usa memoria de sesión del navegador y **no guarda en Firebase**.
No acredita las pruebas de persistencia de las revisiones 2 y 3.
Sin activar esa opción, el envío conserva `registrarIncidencia()` y su transacción
Firestore original; requiere la configuración y las reglas acordadas por el equipo.

### Evidencia y pruebas de frontend

- [Entrega de frontend y recorrido de demostración](docs/frontend-revision-1.md)
- [Bocetos de las cuatro pantallas](docs/bocetos/pantallas-r1.svg)
- [Capturas en móvil y escritorio](docs/capturas/revision-1/README.md)
- [Resultados de pruebas de navegador](docs/pruebas/resultados-ui.json)

Para repetir la comprobación de interfaz:

```powershell
npm ci
npx playwright install chromium
npm run test:ui
# Para regenerar también las capturas y el registro de resultados:
npm run evidence
```

Playwright es una dependencia de desarrollo para las pruebas, no un framework de
la aplicación. La app sigue siendo HTML, utilidades Tailwind y módulos JavaScript.
Si se usa Edge instalado en Windows, se puede definir `PLAYWRIGHT_EXECUTABLE_PATH`
con la ruta de `msedge.exe` antes de ejecutar las pruebas, sin instalar Chromium.


### Identidad visual de la comunidad UG

La interfaz usa azul `#0A263D`, amarillo `#FFD300`, dorado `#8C6E39` y Raleway,
con abejas, panales y una ilustración de arquitectura universitaria.
La investigación se documenta en [referencias de diseño UG](docs/referencias-diseno-ug.md).
La procedencia de los escudos y los gráficos propios está en
[recursos visuales](public/assets/README.md).
