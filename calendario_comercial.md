# 📅 Calendario Comercial y Plan de Marketing Digital - Futunet (2026)

Este documento define la estrategia comercial, de contenido y de diseño UI/UX para la plataforma e-commerce de **Futunet** (Santiago, República Dominicana), orientada tanto al segmento B2C (hogares, profesionales independientes) como B2B (empresas, oficinas e instituciones del Estado).

---

## 🎯 Enfoque Estratégico de Futunet
Futunet opera en tres pilares de alta demanda:
1. **Telecomunicaciones**: Internet de Fibra Óptica Simétrica (Residencial y Corporativo).
2. **Tecnología e Infraestructura**: Equipos de oficina, redes de datos, mobiliario y remozamientos.
3. **Seguridad y Respaldo**: Seguridad electrónica (CCTV, control de acceso) y energía (UPS, paneles solares).

---

## 🗓️ Calendario Comercial Anual (Planificación por Campañas)

| Mes | Nombre de la Campaña | Foco de Producto / Servicio | Segmento Target | Objetivo de Conversión (CTA) |
| :--- | :--- | :--- | :--- | :--- |
| **Enero** | *Año Nuevo, Oficina Nueva* | Mobiliario, Laptops, Cableado Estructurado | B2B / Corporativo | Cotizar equipamiento de oficinas |
| **Febrero** | *Conectados con Amor* | Internet Fibra Hogar, Cámaras inteligentes | B2C / Residencial | Solicitar instalación de Internet |
| **Marzo** | *Productividad sin Pausas* | Equipos de Oficina, Laptops, UPS corporativos | B2B / Pymes | Renovar inventario tecnológico |
| **Abril** | *Espacios Seguros* | Seguridad Electrónica, Controles de Acceso | B2B / Residencial | Solicitar auditoría de seguridad gratis |
| **Mayo** | *Mamá Conectada y Segura* | Smart Home, Laptops, Internet de alta velocidad | B2C | Comprar regalo tecnológico / Internet |
| **Junio** | *Temporada de Respaldo Energético* | UPS Doble Conversión, Inversores, Solar | B2B / B2C | Comprar UPS / Cotizar Paneles Solares |
| **Julio** | *Papá Smart & Gaming* | Laptops de alto rendimiento, Redes WiFi 6 | B2C / Profesionales | Comprar gadgets y equipos avanzados |
| **Agosto** | *Regreso a Clases Tecnológico* | Laptops, Impresoras, Suministros, Internet Lite | B2C (Estudiantes) | Adquirir combos educativos |
| **Septiembre**| *Infraestructura y Redes Premium* | Cableado estructurado, Racks, Remozamiento | B2B (Upgrade anual) | Solicitar levantamiento técnico |
| **Octubre** | *Protección Corporativa* | Biométricos, Sistemas de Alarma, CCTV Industrial| B2B | Cotizar seguridad corporativa |
| **Noviembre** | *Black Friday / Black Month* | Todo el catálogo con ofertas agresivas | B2C / B2B | Compras inmediatas con descuento |
| **Diciembre** | *Cierre de Año y Proyectos 2027* | Renovación de flotas, Remozamiento, Proyectos | B2B (Gasto de presupuesto)| Contratar proyectos llave en mano |

---

## ⚡ Plan de Acción Semanal (Semana Actual: 31 de Mayo - 7 de Junio de 2026)

### 📌 Contexto del Período
* **Hoy (31 de Mayo)**: Cierre de la festividad de **Día de las Madres** en República Dominicana.
* **Mañana (1 de Junio)**: Inicio de la **Temporada Ciclónica (Huracanes) en el Caribe**, la cual genera una altísima preocupación en empresas por caídas de energía y desconexión de servidores.
* **Zona Geográfica**: Santiago y el Cibao (mercado local).

### 1. Transición Estratégica de UI/UX (Home Page & Banner Rotativo)
* **Acción**: Apagar de forma programada los banners del Día de las Madres y encender la campaña **"Temporada de Respaldo Energético"** en la primera posición del slider principal.
* **Propuesta de Banner UI/UX (Campaña de Junio)**:
  * **Fondo**: Imagen de alta calidad de un rack de servidores organizado con una UPS Online encendida o paneles solares instalados en una empresa corporativa local.
  * **Título**: `¿Tu negocio está lista para la temporada ciclónica?`
  * **Subtítulo**: `Garantiza la continuidad de tu empresa con UPS de doble conversión, inversores y paneles solares con instalación inmediata.`
  * **Etiqueta (Label)**: `⚡ Prevención y Energía`
  * **CTAs**: 
    * Botón Principal: `Ver soluciones de energía` -> Enlace a `catalogo.html?cat=energia`
    * Botón Secundario: `Consultar por WhatsApp` -> Mensaje personalizado: *"Hola Futunet, quiero cotizar un sistema de respaldo de energía y UPS para mi negocio ante la temporada de huracanes."*

### 2. Estrategia de Contenidos (Content Manager)
* **Redes Sociales & Sitio Web**: Publicar un artículo corto en el blog o sección de noticias o como banner secundario sobre: *"5 pasos para proteger la infraestructura tecnológica de tu empresa durante la temporada de lluvias en Santiago"*.
* **Productos a Destacar en el Home**:
  * UPS de 1KVA / 2KVA / 3KVA (Doble conversión).
  * Inversores de onda senoidal pura (para equipos electrónicos delicados).
  * Reguladores de voltaje de grado industrial.
  * Baterías de ciclo profundo para respaldo prolongado.

### 3. Activación de Disparador Comercial (Marketing)
* **Código de Descuento Activo**: `RESPALDO2026`
  * **Valor**: 10% de descuento en la categoría de "Energía y respaldo" (UPS, inversores).
  * **Vigencia**: 1 de Junio al 15 de Junio de 2026.
  * **Mensaje Clave**: *"No dejes que un apagón detenga tu empresa. Usa el código RESPALDO2026 al cotizar."*

---

## 🛠️ Implementaciones Técnicas Propuestas en el Sitio Web

Para facilitar la ejecución de esta estrategia de manera **dinámica y automatizada**, proponemos dos mejoras específicas en el código del catálogo y panel de administración:

1. **Campos de Programación Temporal en Banners (Firestore)**:
   * Agregar `startDate` y `endDate` al modelo de banners para que se activen y desactiven automáticamente según la semana del calendario comercial, sin requerir intervención manual constante.
2. **Módulo de "Planificador Comercial" en el Admin Dashboard**:
   * Una vista donde el Content Manager pueda ver las campañas activas de la semana, los códigos promocionales recomendados y acceda a un generador automático de copies para redes y WhatsApp.
