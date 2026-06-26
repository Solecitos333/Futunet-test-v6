
## 2024-05-18 - Missing ARIA labels in dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons in template literals (like product quantity `+`/`-` or modal close `&times;` buttons) often bypass static accessibility analysis tools, meaning accessibility attributes must be explicitly synchronized across all view variations (e.g., standard vs. compact layouts).
**Action:** When working on UI components generated via JS template strings, ensure `aria-label` attributes are consistently applied to all interactive elements lacking text content across all possible variations.
