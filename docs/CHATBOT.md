# Asistente público con Gemini

Publicado en septiembre de 2026. El bot usa Firebase AI Logic con Gemini 3.6 Flash y la plantilla de servidor `futunet-support-v1`. No depende de Render ni necesita copiar la clave privada del panel al navegador público.

## Configuración

- Proyecto: `futunet-web`. Se habilitaron Firebase AI Logic, Gemini Developer API, App Check y reCAPTCHA Enterprise. El proyecto conserva Spark, sin facturación habilitada.
- Plantilla: `tools/futunet-support.prompt`. Para cambiar modelo, instrucciones o esquemas, actualizar esa plantilla en Firebase Console → AI Logic → Prompt templates. El frontend solo envía el identificador y las variables permitidas.
- Solo se permiten solicitudes por plantilla (`trafficFilter.templateOnly`). La telemetría de conversaciones está desactivada. App Check se exige en Firebase AI Logic; su identificador de servicio de App Check es `firebaseml.googleapis.com`.
- reCAPTCHA Enterprise está configurado para `futunet.com.do`, `futunet-web.web.app` y `futunet-web.firebaseapp.com`. Su site key es pública. La autenticación ante Gemini la gestiona Firebase; no se publica ninguna clave secreta de Gemini.
- El módulo administrativo muestra accesos a la prueba pública y a Firebase únicamente a superadministradores verificados de plataforma. El asistente privado del panel conserva su configuración.

## Comportamiento

El asistente recibe el mensaje y hasta seis pares de conversación, con límites de longitud. Pregunta por el problema, conserva el contexto, propone diagnósticos reversibles y prepara un borrador cuando hay información suficiente o el visitante pide una persona.

Consulta únicamente la configuración pública y una proyección del catálogo activo (título, marca, categoría, descripción y precio), con hasta cinco coincidencias entre un máximo de 500 productos. No envía costos, cuentas, pedidos, tickets, capturas ni notas internas. Una búsqueda sin coincidencias no demuestra ausencia en todo el catálogo.

El contenido generado se valida y se muestra como texto. Los enlaces de productos solo se forman con identificadores del contexto público. El usuario revisa el borrador en soporte y puede modificarlo y adjuntar imágenes antes de enviar. La IA no crea tickets ni contacta personas por sí sola.

Las consultas tienen un límite de espera de 32 segundos. Ante fallos de red, attestation, cuota o respuestas malformadas, se conserva lo explicado y se ofrece crear el ticket. Las cuotas gratuitas de Gemini y reCAPTCHA pueden limitar la asistencia; los tickets funcionan independientemente.

## Publicación y verificación

El dominio `futunet.com.do` se publica mediante GitHub Pages desde `main`; Firebase Hosting mantiene el espejo `futunet-web.web.app`. Publicar el frontend en ambos destinos. `firebase.json` incluye los orígenes de reCAPTCHA necesarios para la política de contenido del espejo.

`npm test` comprueba contexto, privacidad, selección de productos, respuestas inválidas, cambio de cuenta, duplicados y traspaso revisable. `npm run validate` valida referencias y el artefacto de Hosting. Las reglas y pruebas de tickets se describen en [SUPPORT.md](SUPPORT.md).

Se verificó una respuesta real de Gemini que devuelve el ticket estructurado y el rechazo de consultas sin App Check. El modelo puede equivocarse; el borrador siempre requiere revisión del usuario.

Referencias oficiales: [Firebase AI Logic](https://firebase.google.com/docs/ai-logic/get-started?platform=web), [plantillas del servidor](https://firebase.google.com/docs/ai-logic/server-prompt-templates/get-started), [App Check](https://firebase.google.com/docs/ai-logic/app-check).
