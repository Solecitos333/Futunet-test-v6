## 2024-05-24 - Missing ARIA labels on dynamic icon-only quantity buttons
**Learning:** Dynamically generated icon-only buttons (like the `+` and `-` quantity controls in `js/cart.js` and `js/catalog.js` using template literals) lack static analysis coverage for accessibility, making them prone to missing `aria-label` attributes.
**Action:** Always ensure `aria-label` attributes are explicitly included when constructing icon-only buttons via JavaScript string literals to maintain keyboard accessibility and screen reader support.
