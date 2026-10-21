## 2025-02-20 - Adding ARIA labels to dynamically generated +/- quantity buttons
**Learning:** Icon-only buttons generated dynamically via template literals in vanilla JavaScript files (like `cart.js` and `catalog.js`) are a common source of accessibility gaps because they lack static analysis coverage from standard HTML linters.
**Action:** When working on pure JS frontend components, always double-check template literals containing interactive elements (buttons, links) to ensure they have appropriate `aria-label` attributes if their visual content is purely iconic.
