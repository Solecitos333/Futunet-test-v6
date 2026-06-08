
## 2026-06-08 - Added ARIA labels to dynamically generated icon-only buttons
**Learning:** Icon-only buttons used for quantity control ("-" and "+") and modal close ("&times;") in dynamically generated HTML string templates lack accessible names for screen readers. Since these templates bypass static analysis and traditional UI components, accessibility regressions can easily slip in when dynamic components are rendered.
**Action:** When working with dynamically generated HTML in plain JavaScript files (using template literals), explicitly review all `<button>` tags, especially those containing only icons or text symbols, and ensure they have a localized, descriptive `aria-label` attribute (e.g., `aria-label="Agregar una unidad"` in Spanish).
