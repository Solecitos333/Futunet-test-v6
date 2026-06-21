## 2024-05-14 - Missing ARIA labels in dynamic JS components
**Learning:** Found dynamically generated components via JS (`js/cart.js`) lacking accessibility ARIA attributes for icon-only buttons (- and +).
**Action:** Ensure that buttons generated from template literals have appropriate `aria-label` attributes to ensure they are accessible.
