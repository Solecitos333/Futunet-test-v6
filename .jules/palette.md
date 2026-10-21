## 2024-05-12 - ARIA Labels for Dynamic Quantity Buttons
**Learning:** Icon-only and symbol-only (`-`/`+`) buttons dynamically generated in template literals (e.g., `js/catalog.js` and `js/cart.js`) often lack accessible names for screen readers.
**Action:** When working with dynamically generated HTML containing interactive controls that only use symbols or icons, explicitly add descriptive `aria-label` attributes to ensure keyboard and screen reader accessibility.
