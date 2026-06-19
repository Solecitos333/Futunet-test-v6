## 2024-11-20 - Accessible Interactive Icons
**Learning:** Dynamically generated HTML components in vanilla JavaScript (e.g., cart and product quantity controls using template literals) lack static analysis coverage for accessibility.
**Action:** Always ensure `aria-label` attributes are explicitly added to icon-only buttons like `-` and `+` during dynamic generation, ensuring contextual and localized meaning (e.g., "Agregar una unidad").
