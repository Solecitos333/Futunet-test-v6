# Asistente público con Gemini

Implementación local; requiere publicar frontend, backend y reglas. La conversación usa Gemini a través de `POST /api/chatbot/message` en el backend de Futunet. El navegador nunca recibe la clave. El asistente privado del panel conserva su configuración actual.

## Activación

1. Publicar el backend incluyendo `chatbot_api.py`, el cambio en `main.py` y `httpx==0.28.1` de `requirements.txt`. Debe disponer de Firebase Admin con acceso al proyecto del sitio. El dominio público del sitio debe estar en los orígenes CORS permitidos.
2. Publicar las reglas de Firestore y el frontend conforme a [SUPPORT.md](SUPPORT.md). `chatbot_secrets` deniega lectura y escritura desde todos los SDK cliente, incluso superadmin.
3. Entrar con una cuenta verificada de **superadministrador de plataforma** en **Soporte y errores → Asistente inteligente · Gemini**. Introducir una clave de Gemini y guardar, o pulsar **Usar la clave de este navegador** para reutilizar la que ya utiliza el asistente privado del panel. Este botón envía la clave mediante HTTPS y un token Firebase al backend; no la devuelve a la interfaz. El estado confirma configuración guardada, no una llamada exitosa al proveedor.
4. Como alternativa, definir `GEMINI_API_KEY` (o `GOOGLE_API_KEY`) en el entorno del backend. La clave del entorno tiene prioridad sobre la guardada. `GEMINI_MODEL` fija el modelo opcionalmente; si no existe, se usa el seleccionado en el panel. El valor inicial es `gemini-3.6-flash`; también se permiten `gemini-3.8-flash` y `gemini-2.5-flash`.
5. Hacer una consulta real desde el sitio publicado y comprobar la respuesta de Gemini, después probar una incidencia y revisar el borrador en soporte. Si la clave anterior tiene restricciones incompatibles con llamadas desde el servidor, revisar su configuración en Google. No poner claves en HTML, archivos públicos ni parámetros de URL.

Los endpoints `GET/PUT /api/chatbot/settings` verifican token revocado, correo verificado, perfil activo, rol superadmin y ausencia de empresa. Solo GET devuelve estado/modelo, nunca la clave. Un fallo al consultar la configuración impide usar Gemini para respetar la desactivación administrativa.

## Comportamiento

- Conserva hasta seis pares de mensajes y 10 000 caracteres de contexto en memoria de la pestaña. El usuario puede empezar otra conversación. Cerrar el chat lo conserva; recargar lo descarta; salir de una cuenta o cambiarla limpia la conversación y descarta respuestas pendientes.
- Utiliza únicamente campos públicos de `config/site` y hasta cinco productos relevantes del catálogo activo. La consulta proyecta título, marca, categoría, descripción y precio; no envía costos, cuentas, facturas, pedidos, tickets ni notas internas a Gemini. Los datos del catálogo se almacenan en memoria durante 60 segundos, hasta 500 productos; una búsqueda sin resultados no demuestra que no exista un producto en un catálogo mayor.
- Los mensajes escritos por el visitante y el contexto reciente sí se envían a Google. La interfaz lo informa. La aplicación no persiste conversaciones de chat en Firestore ni registra sus textos/claves. El tratamiento del proveedor se rige por sus condiciones.
- El modelo recibe instrucciones para pedir información relevante, no repetir preguntas ya contestadas, evitar promesas y preparar un borrador objetivo. La aplicación valida la estructura de la respuesta y permite enlaces de productos solo a IDs presentes en el contexto. El texto generado nunca se inserta como HTML.
- El botón de soporte traslada el resumen a `soporte.html`, donde el usuario puede corregirlo y adjuntar capturas antes de enviar. Si Gemini falla, se trasladan los últimos mensajes del usuario. No se crea un ticket ni se contacta a un agente por decisión del modelo.
- Solo al pulsar el botón se guarda un borrador en `sessionStorage`, vinculado a la cuenta, con caducidad de 20 minutos. Se elimina al importarse. No incluye capturas. Un formulario ya escrito requiere pulsar **Usar borrador del asistente** antes de reemplazarlo.
- Límites por proceso: 10 consultas por IP/minuto, 60 totales/minuto, cuatro llamadas simultáneas y 1 000 consultas diarias (`CHATBOT_DAILY_LIMIT`). Los contadores reinician con el proceso y no se comparten entre réplicas. Para varios procesos o una cuota monetaria estricta hace falta un contador compartido y controles del proveedor. No se confía directamente en `X-Forwarded-For`; el proxy de despliegue debe establecer correctamente la IP cliente.
- Mensaje máximo: 1 500 caracteres; cuerpo máximo: 24 KB; tiempo total del servidor: 28 segundos. Los fallos, límites, bloqueos o respuestas malformadas permiten continuar con soporte y WhatsApp. Las respuestas del backend no se almacenan en caché.

## Validación

Frontend: `npm test`, `npm run test:support:rules`, `npm run validate`.

Backend, desde `futunet-backend`: `python -m unittest test_main test_chatbot_api -v`.

La prueba local `tools/chatbot-preview.html` sirve el código real de la interfaz con respuestas de prueba, sin llamar a Google ni crear tickets. Se excluye del Hosting. Permite probar respuesta normal, fallo del servidor y límite de consultas. Los tests del backend usan `httpx.MockTransport` para verificar el protocolo REST, errores y formato estructurado sin gastar cuota ni usar claves reales.

No se ha verificado una respuesta real de Gemini en esta sesión: falta activar la credencial en el servidor y publicar el cambio. La verificación simulada cubre la integración y los errores; no garantiza la calidad de todas las respuestas del modelo.

Referencias: [protección de claves de Gemini](https://ai.google.dev/gemini-api/docs/api-key), [salida estructurada](https://ai.google.dev/gemini-api/docs/generate-content/structured-output), [modelos disponibles](https://ai.google.dev/gemini-api/docs/models).
