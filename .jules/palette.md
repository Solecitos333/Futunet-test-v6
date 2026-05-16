## 2024-05-16 - ARIA labels for dynamic UI elements
**Learning:** Icon-only buttons (like quantity controls) that are generated dynamically via JavaScript template literals often miss static accessibility checks and lack `aria-label` attributes by default, making them inaccessible to screen readers.
**Action:** Always ensure that any interactive elements (especially icon-only buttons) generated dynamically in JavaScript include appropriate `aria-label` or other accessible text attributes.
