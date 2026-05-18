## 2024-05-18 - Missing ARIA Labels on Dynamically Generated Buttons
**Learning:** Dynamically generated HTML components in JavaScript (e.g., cart and product quantity controls using template literals) lack static analysis coverage for accessibility, making them prone to missing ARIA attributes.
**Action:** Ensure `aria-label` attributes are explicitly added to icon-only buttons like `-` and `+` during dynamic generation, as they won't be caught by standard HTML linting.
