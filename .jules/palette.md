## 2026-05-10 - ARIA Labels for Dynamic Icon-Only Buttons
**Learning:** Dynamically generated HTML components in JavaScript (e.g., cart quantity controls using template literals) can easily miss static accessibility checks. Icon-only buttons like `-` and `+` need explicit `aria-label` attributes containing contextual information (like the product name) for screen readers.
**Action:** When reviewing dynamically generated HTML components, check if icon-only buttons have descriptive `aria-label`s. Consider using utility functions to sanitize interpolated values used in ARIA attributes.
