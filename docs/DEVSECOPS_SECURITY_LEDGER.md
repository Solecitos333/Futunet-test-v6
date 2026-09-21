# 🛡️ Futunet — DevSecOps & Cybersecurity Master Ledger
> **Rol:** Ingeniero DevSecOps & Especialista en Ciberseguridad Senior  
> **Objetivo:** Auditoría continua de código fuente, frontend, formularios, OWASP Top 10, ASVS v4.0 y privacidad (Ley 172-13 / RGPD), aplicando mitigaciones seguras e incrementales con regresión cero.  
> **Última Actualización:** 2026-09-15  

---

## 1. Diagrama de Flujo de Auditoría & Mitigación Diaria

```mermaid
flowchart TD
    subgraph Deteccion["1. Detección & Modelado"]
        A1[Análisis Estático SAST] --> A2[Revisión Manual de Código]
        A2 --> A3[Mapeo OWASP Top 10 & ASVS v4.0]
    end

    subgraph Clasificacion["2. Clasificación"]
        A3 --> B1[Matriz de Riesgo CVSS]
        B1 --> B2[Evaluación de Impacto en Negocio]
    end

    subgraph Mitigacion["3. Mitigación Incremental"]
        B2 --> C1[Diseño de Parche Atómico]
        C1 --> C2[Implementación Segura]
    end

    subgraph Verificacion["4. Verificación & Regresión Zero"]
        C2 --> D1[Ejecución de Suites Automatizadas]
        D1 --> D2{¿Pasa 100% de Pruebas?}
        D2 -- No --> C1
        D2 -- Sí --> D3[Aprobación DevSecOps]
    end

    subgraph Documentacion["5. Bitácora & Memoria de Sesión"]
        D3 --> E1[Actualización de Comentarios en Código]
        E1 --> E2[Actualización de Master Ledger]
    end
```

---

## 2. Diagrama de Arquitectura de Defensa en Profundidad

```mermaid
graph LR
    User[Navegador / Cliente] -->|HTTPS + HSTS + CSP| CDN[Firebase Hosting / CDN]
    CDN --> Front[Frontend PWA / Vanilla JS]
    Front -->|Honeypot + Cooldown + Sanitize| Form[Formularios Web]
    Form -->|SDK Compat + Token Auth| FStore[(Firestore DB)]
    Form -->|Reglas MIME + Size Limit| FStoreStorage[(Firebase Storage)]
    Front -->|REST API + CORS + Rate Limit| Back[FastAPI Backend Render]
    Back -->|Service Account Protegida| FAdmin[Firebase Admin SDK]
```

---

## 3. Matriz de Controles de Seguridad Implementados (Auditados)

| Capa | Componente / Archivo | Vector / Control OWASP | Estado | Descripción de la Mitigación |
| :--- | :--- | :--- | :--- | :--- |
| **Formularios** | `index.html`, `sugerencias.html`, `internet.html`, `punto-de-venta.html`, `login.html` | Anti-Automation / Spambots | **ACTIVO (PASS)** | Trampa Honeypot invisible `name="_hp_security_check"` en los 8 formularios públicos críticos. |
| **Privacidad** | Formularios con PII (Nombres, Cédulas, Teléfonos, RNC) | Cumplimiento Ley 172-13 / ARCO | **ACTIVO (PASS)** | Checkboxes de consentimiento informado obligatorio vinculando a `privacidad.html` con `rel="noopener noreferrer"`. |
| **Rate Limiting** | `js/suggestions.js`, `js/internet-portal.js`, `login.html` | Anti-DoS / Brute Force | **ACTIVO (PASS)** | Cooldowns temporales en cliente (15s sugerencias, 10s registro) y bloqueo exponencial por intentos fallidos (login lockout). |
| **Sanitización** | `js/suggestions.js`, `js/internet-portal.js`, `punto-de-venta.html` | Inyección de Código / XSS | **ACTIVO (PASS)** | Eliminación estricta de tags HTML (`<...>`), caracteres de control ASCII (`\x00-\x08`, `\x0B-\x1F`) y límites de longitud. |
| **Autenticación** | `login.html`, `js/auth-guard.js`, `js/auth.js` | Open Redirect (CWE-601) | **ACTIVO (PASS)** | Validación estricta con URL parser, allowlist de rutas relativas locales y coincidencia de origen (`window.location.origin`). |
| **Cabeceras** | `firebase.json` | Injection, Clickjacking, MIME-Sniff | **ACTIVO (PASS)** | HSTS (1 año + preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer-Policy, Permissions-Policy, COOP, CORP, CSP. |
| **Storage** | `storage.rules` | Subida de Archivos Arbitrarios | **ACTIVO (PASS)** | Restricción de tipos MIME a solo `image/(jpeg\|png\|webp)` y `application/pdf`, con límite estricto de 5MB a 8MB según carpeta. |
| **Backend API** | `futunet-backend/main.py` | Exposición de Secretos / CORS | **ACTIVO (PASS)** | Credenciales excluidas de Git (`.gitignore`), CORS restringido por origen, middleware de cabeceras de seguridad y rate limiter por IP. |

- **DOM XSS & Reverse Tabnabbing Mitigation (Hardening de Enlaces y Renderers)**:
  - Sanitización estricta con `escapeHtml` en interpolaciones dinámicas de `home_showcase.js`, `cart.js` y `brand-page-loader.js`.
  - Inclusión de `rel="noopener noreferrer"` en todos los hipervínculos con `target="_blank"` (`catalog.js`, `brand-page-loader.js`, `admin-panel.js`) y `'noopener,noreferrer'` en `window.open` (`producto.js`, `catalog.js`).
  - Protección preventiva de `TypeError` en `promo-carousel.js` y `brands-preview.js` ante propiedades indefinidas en documentos de Firestore.
  - Corrección de ancla `#cotizador` en `seguridad-electronica.html` y ancla `#sp-cases` en `soporte.html` para navegación fluida y sin saltos rotos.
  - Sincronización reactiva del carrito entre pestañas y panel de usuario mediante eventos `futunet-cart-updated` y `storage`.
  - Protección estática de formularios B2B: honeypots y consentimiento de privacidad Ley 172-13 integrados directamente en el HTML de las 6 páginas de servicios (`corporativo`, `energia-climatizacion`, `equipos-oficina`, `redes-datos`, `infraestructura-remozamiento`, `seguridad-electronica`).
  - Blindaje defensivo de DOM contra `null dereference` en `cart.js`, `chatbot.js`, `public-quote.js`, `suggestions.js`, `producto.js` y `user-panel.js`.
  - Actualización de Service Worker a `futunet-cache-v22` con precaching opcional de `gaming.html`, `corporativo.html`, `terminos.html` y `privacidad.html`.
  - Auditoría de integridad de activos del catálogo: validación del 100% (251 referencias de imagen) y corrección de ruta rota en `prod_irpyxjvid` (`img/camaras.jpg`).

---

## 4. Comandos de Verificación Inmediata

Ejecutar desde `proyecto_github_pages/`:
```bash
# 1. Pruebas de seguridad de formularios y privacidad
node tools/test-forms-security.cjs

# 2. Pruebas completas de contratos y estabilidad
npm test

# 3. Validación estructural y preparación de hosting
npm run validate
```

---


---

## 6. Registro de Atención Autónoma del Buzón de Sugerencias y Telemetría de Búsqueda (2026-09-21)

### Hallazgos de Telemetría y Propuestas de Usuarios Atendidas
1. **Computadoras de Escritorio Dell SFF (`SUG-D3050`)**:
   - Demanda recurrente en búsquedas (`core i5 2.7/3.4 mhz 8gb ram 250/500gb dd usados dell sff`, `optiplex`).
   - Incorporados los modelos `pc_dell_optiplex_7050_sff`, `pc_dell_optiplex_5050_sff`, `pc_dell_optiplex_3050_sff` con discos NVMe, procesadores Core i5 y garantía de 1 año.
2. **Monitores IPS Full HD y Filtro de Marca LG (`SUG-M2480`)**:
   - Requerimiento de pantallas de oficina de 24" y 27" con protección ocular (Flicker Safe).
   - Incorporados `mon_lg_24mp400_b_fhd`, `mon_lg_27mp400_b_fhd` y `mon_dell_se2422h_fhd`.
   - Marca **LG** integrada en `preferredNames` y `priorityList` de catálogo.
3. **Cámaras de Seguridad Hikvision y Grabadores DVR (`SUG-H7200`)**:
   - Búsquedas de CCTV y videovigilancia con visión nocturna a color.
   - Incorporados `sec_hikvision_cam_colorvu_1080p` (ColorVu 24/7) y `sec_hikvision_kit_dvr_4ch` (4 canales + app móvil).
4. **Seguridad y Precisión en el Motor de Búsqueda (`catalog.js`)**:
   - Aislamiento estricto de tokens de longitud $\le 3$ caracteres (evitando que "lg" matchee falsos positivos en "pulgadas").
   - Puntuación proporcional multitérmino para consultas extensas ($\ge 3$ palabras).
5. **Muro Comunitario Interactivo (`sugerencias.html`, `suggestions.css`, `suggestions.js`)**:
   - Pestañas de filtrado por categoría ("Todas las Ideas", "Catálogo y Productos", "Plataforma Web", "Servicios y Soporte").
   - Persistencia de respuestas oficiales en Firestore `suggestions` y respaldo offline para los 16 registros canónicos.
   - Cobertura de pruebas unitarias al 100% (115/115 tests exitosos en `npm test`).


