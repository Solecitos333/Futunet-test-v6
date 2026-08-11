## 2024-05-24 - Missing ARIA Labels on Dynamically Generated Buttons
**Learning:** Dynamically generated HTML components in JavaScript (e.g., cart and product quantity controls using template literals) lack static analysis coverage for accessibility; ensure aria-label attributes are explicitly added to icon-only buttons like - and + during dynamic generation.
**Action:** Add aria-label attributes to icon-only buttons generated via template literals in js/cart.js.
