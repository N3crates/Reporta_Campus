# Forma de trabajar en ReportaCampus

Instrucción del responsable del proyecto a partir del 21 de noviembre de 2026:
usar código legible y separado por responsabilidades, siguiendo el formato
observado en la clase del 5 de noviembre. Ver `docs/organizacion.md`.

- Mantener HTML, Tailwind por CDN, Google Fonts y JavaScript con Firebase.
  El ejemplo de la clase usa PHP; no implica migrar este proyecto a PHP.
- Indentar con cuatro espacios. En JavaScript, terminar instrucciones con punto y coma.
- Una instrucción por línea; bloques `if`, bucles, funciones y objetos extensos
  en varias líneas. Evitar funciones comprimidas y ternarios anidados.
- Escribir la estructura de las pantallas y las vistas en archivos HTML con
  etiquetas anidadas e indentadas. No construir páginas con cadenas HTML gigantes.
- Dejar encabezado, pie y elementos repetidos en `public/vistas/`.
- Separar funciones de presentación (`public/js/funciones.js`), navegación
  (`public/js/ui.js`), código por página (`public/js/pages/`) y acceso a Firebase.
- Usar `textContent` para datos del usuario. `innerHTML` se limita a cargar
  las vistas HTML estáticas propias del proyecto.
- No añadir package.json, lockfiles, node_modules, frameworks, compiladores ni
  servidores de aplicación Node a esta entrega estática. Para servirla, usar Live Server.
  Las herramientas externas de verificación no se copian al repositorio.
- Conservar evidencias y atribuciones. Retirar archivos vacíos o sin uso,
  documentando las eliminaciones; no eliminar funciones útiles de compañeros.
- Distinguir muestras locales de persistencia real. No marcar como probado
  un envío, permiso o flujo que no se haya ejecutado contra el entorno correspondiente.
- Trabajar en rama separada y mantener la revisión humana antes de integrar en develop.
