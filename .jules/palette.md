
## 2024-05-24 - Inconsistent ARIA labels in dynamic template literals
**Learning:** When building responsive UI components using dynamic HTML template literals, accessibility attributes like `aria-label`s on icon-only buttons are often forgotten in specific variants (like the 'standard' layout while the 'compact' one has them).
**Action:** Always verify all structural branches (e.g., `if (compact) ... else ...`) inside dynamic view rendering functions for consistent accessibility coverage, especially on icon-only interactive elements.
