## 2024-05-24 - Missing ARIA labels on dynamic icon buttons
**Learning:** Icon-only buttons generated dynamically via template literals (like quantity controls in cart or catalog) often lack `aria-label` attributes, making them inaccessible to screen readers, especially when conditional view variants exist.
**Action:** Always verify `aria-label` is present on all template literal branches for icon-only buttons (e.g. `+` and `-` quantity buttons) across the codebase.
