## 2025-02-18 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Dynamically generated HTML components in vanilla JS lack static analysis coverage for accessibility checks, resulting in missing `aria-label` attributes on icon-only buttons like `-` and `+`.
**Action:** When creating icon-only buttons dynamically using template strings in JS, always ensure to manually add an `aria-label` attribute describing the action (e.g. `aria-label="Agregar una unidad"`).
