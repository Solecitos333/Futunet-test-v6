# Soporte y reclamaciones

Publicado en septiembre de 2026. Los tickets funcionan sin IA. El asistente público usa Gemini mediante Firebase AI Logic según [CHATBOT.md](CHATBOT.md). Se publicaron el frontend, las reglas y los índices y se verificaron tickets reales con imágenes, respuestas, notas internas y aislamiento entre cuentas; los datos de prueba se eliminaron al finalizar.

## Uso

- Público: `soporte.html`, enlazado desde el menú compartido, el chat comercial y Mi cuenta. El formulario guiado ofrece orientación y prepara un resumen revisable. Además, el asistente conversacional con Gemini ayuda a organizar el caso y puede trasladar un borrador al formulario. También se puede crear el ticket directamente.
- El visitante puede preparar su caso sin autenticarse; enviar, responder y consultar requiere una cuenta de correo verificada. El inicio de sesión abre otra pestaña para conservar el formulario. El borrador no se guarda en localStorage; abandonar o recargar la página lo descarta.
- Panel: `admin.html#support`, sección **Soporte y errores**, con contador de casos activos en la barra lateral. El contador y la bandeja se actualizan mientras está abierto el panel, sobre los últimos 200 casos. No se envían correos/push ni se detectan caídas automáticamente.
- Administradores de plataforma y agentes de soporte gestionan todos los casos. Editores, cobros y marketing de plataforma colaboran en errores internos. Usuarios restringidos a una empresa conservan acceso únicamente a sus propios casos como clientes.
- Cada caso ofrece prioridad, asignación al operador actual, estado, conversación, capturas descargables y notas privadas. Las respuestas del cliente reabren casos resueltos o esperando información. Un caso cerrado debe reabrirlo el equipo antes de recibir respuestas públicas.
- La bandeja permite buscar y filtrar los últimos 200 casos. Los anteriores pueden abrirse con su ID completo/enlace. La conversación muestra los últimos 100 mensajes y las notas los últimos 100 registros.

## Datos y permisos

`support_tickets/{id}` contiene el reporte inmutable, propietario, origen, estado, prioridad, responsable, revisión y fechas de servidor. Subcolecciones:

- `messages`: conversación compartida, autor y fecha verificables; sin edición/borrado.
- `notes`: notas privadas para quienes pueden gestionar ese caso; nunca se mezclan con los mensajes públicos.
- `attachments`: hasta tres JPEG optimizados. Se admite entrada PNG/JPG/WebP de hasta 5 MiB; se decodifica y vuelve a codificar (máximo 1800 px, máximo 350 000 caracteres base64 por imagen). Esto elimina EXIF y reduce el tamaño. El archivo original no se conserva. Las imágenes están fuera del documento principal para evitar descargarlas al listar tickets.

Los adjuntos usan documentos Firestore privados, no URLs públicas de Storage. El ticket, sus capturas y el control de frecuencia se confirman en una transacción: no hay tickets parcialmente enviados ni archivos huérfanos por fallo de subida. Esta decisión favorece reportes de bajo volumen; a gran escala o para adjuntos de mayor tamaño conviene migrarlos a Storage con acceso autenticado y un proceso de finalización en servidor.

`support_rate_limits/{uid}` aplica un ticket cada 30 segundos con hora de servidor. Un ID estable por intento evita duplicados al reintentar creación o respuesta sin recargar la página. La revisión evita sobreescrituras silenciosas de cambios concurrentes. Los estados y la prioridad nunca son editables por clientes, y los permisos se comprueban con Firestore Rules, independientemente de los controles de la pantalla.

La página afectada excluye credenciales, parámetros y fragmentos. El navegador y tamaño de pantalla se incluyen solo mediante la casilla correspondiente. Las páginas de soporte y administración no habilitan persistencia Firestore en disco. Los fallos no se presentan como envíos confirmados.

## Pruebas reproducibles

Recomendado: Node 22 o 24, Java 21 y `npm ci`.

```sh
npm test
npm run test:support:rules
npm run validate
```

En Windows, si Java no está en PATH, define `JAVA_HOME` para tu instalación y añade su directorio `bin` antes de ejecutar los emuladores.

`test-support-core.cjs`: validación, enlaces, roles y límites de archivos. `test-support-ui.cjs`: invitado, reintento, escape de HTML, filtros y cambio de cuenta. `test-support-rules.cjs`: pruebas contra Firestore Emulator de suplantación, aislamiento, notas privadas, capturas, estados, concurrencia y transacciones del servicio real. Los mensajes PERMISSION_DENIED en pruebas negativas son esperados. Los tests siempre usan `demo-futunet-support`, nunca producción.

Prueba manual con SDK Firebase 10.12.0, igual al sitio:

```sh
npm run preview:support:emulators
# En otra terminal:
node tools/seed-support-preview.cjs
python -m http.server 8765 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8765/tools/support-preview.html?actor=customer`. Cambia entre cliente, soporte y editor con los enlaces de prueba. Los datos son ficticios y locales. La herramienta se excluye del paquete Hosting y solo funciona en localhost.

## Publicación

1. Revisar las modificaciones existentes del repositorio antes de publicar: hay otros cambios locales ajenos a soporte.
2. Incorporar los dos índices compuestos de `firestore.indexes.json` a los índices existentes del proyecto remoto, conservando los que ya utiliza el sitio. No aceptar la eliminación de índices remotos ajenos a este cambio. La exclusión `attachments.dataUrl` evita indexar el contenido de las imágenes.
3. Publicar reglas e índices con Firebase CLI autenticado para el proyecto correcto; esperar a que los índices estén listos:

   ```sh
   npx firebase deploy --project futunet-web --only firestore:rules,firestore:indexes
   ```

4. Ejecutar `npm run validate` y publicar el sitio:

   ```sh
   npx firebase deploy --project futunet-web --only hosting
   ```

5. Verificar en producción con cuentas autorizadas: enviar un caso, adjuntar captura, responder desde soporte y confirmar el aislamiento de notas. Sin publicar reglas e índices, la versión web nueva no podrá operar.

La captura automática de fallos, alertas fuera del panel e integraciones de correo no forman parte de esta entrega. Gemini orienta al visitante; no diagnostica ejecutando acciones en la web.

Referencias: [consultas y reglas de Firestore](https://firebase.google.com/docs/firestore/security/rules-query), [condiciones y operaciones atómicas](https://firebase.google.com/docs/firestore/security/rules-conditions).
