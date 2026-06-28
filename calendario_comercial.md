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

## ⚡ Plan de Acción Semanal (Semana Actual: 28 de Junio - 5 de Julio de 2026)

### 📌 Contexto del Período
* **Hoy (28 de Junio)**: Cierre de la campaña de **Respaldo Energético** como foco principal, aunque se mantiene activa como secundaria debido a que la Temporada Ciclónica continúa (Junio-Noviembre).
* **Esta Semana (1 de Julio)**: Inicio de la campaña de **Día de los Padres** ("Papá Smart & Gaming"), enfocada en laptops de alto rendimiento, gadgets tecnológicos y routers WiFi 6 de largo alcance.
* **Zona Geográfica**: Santiago y la región del Cibao.

### 1. Transición Estratégica de UI/UX (Home Page & Banner Rotativo)
* **Acción**: Mover el banner de la Temporada de Respaldo Energético a posiciones secundarias y encender la campaña **"Papá Smart & Gaming"** en la primera posición del slider principal de banners.
* **Propuesta de Banner UI/UX (Campaña de Julio)**:
  * **Fondo**: Imagen de alta calidad de una laptop gaming y router WiFi 6 premium con luces ambientales RGB en Santiago (`img/banners/papa_smart_gaming.png`).
  * **Título**: `Regala potencia y conectividad en el Mes del Padre`
  * **Subtítulo**: `Laptops de alto rendimiento, routers WiFi 6 y gadgets con 10% de descuento usando el código PAPASMART2026.`
  * **Etiqueta (Label)**: `🎮 Papá Smart & Gaming`
  * **CTAs**: 
    * Botón Principal: `Ver Equipos y Laptops` -> Enlace a `catalogo.html?cat=equipos`
    * Botón Secundario: `Consultar por WhatsApp` -> Mensaje personalizado: *"Hola Futunet, quiero cotizar laptops y routers WiFi 6 para regalar en el día de los padres con el código PAPASMART2026."*

### 2. Estrategia de Contenidos (Content Manager)
* **Redes Sociales & Sitio Web**: Publicar contenido y posts semanales sobre: *"Guía de regalos tecnológicos: Laptops de alto rendimiento para padres profesionales y gamers en Santiago"*.
* **Productos a Destacar en el Home**:
  * Laptops ASUS ROG / TUF, Dell G15 o Lenovo Legion (Gaming y alto rendimiento).
  * Laptops de productividad avanzada (Dell Latitude / HP ProBook).
  * Routers Mesh WiFi 6 de largo alcance (TP-Link Deco, Ubiquiti UniFi, MikroTik).
  * Teclados mecánicos y accesorios gamer (Logitech).

### 3. Activación de Disparador Comercial (Marketing)
* **Código de Descuento Activo**: `PAPASMART2026`
  * **Valor**: 10% de descuento en las categorías de "Equipos de Oficina / Cómputo" y "Redes / Routers WiFi".
  * **Vigencia**: 1 de Julio al 31 de Julio de 2026.
  * **Mensaje Clave**: *"Sorprende a papá con la máxima velocidad y rendimiento. Usa el código PAPASMART2026 al cotizar."*

---

## 🛠️ Implementaciones Técnicas Propuestas en el Sitio Web

Para facilitar la ejecución de esta estrategia de manera **dinámica y automatizada**, proponemos dos mejoras específicas en el código del catálogo y panel de administración:

1. **Campos de Programación Temporal en Banners (Firestore)**:
   * Agregar `startDate` y `endDate` al modelo de banners para que se activen y desactiven automáticamente según la semana del calendario comercial, sin requerir intervención manual constante.
2. **Módulo de "Planificador Comercial" en el Admin Dashboard**:
   * Una vista donde el Content Manager pueda ver las campañas activas de la semana, los códigos promocionales recomendados y acceda a un generador automático de copies para redes y WhatsApp.
