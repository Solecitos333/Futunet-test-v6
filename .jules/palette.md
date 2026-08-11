## 2026-06-03 - Added aria-label to dynamically generated icon-only buttons
**Learning:** Dynamically generated HTML templates in JS files (like cart item generation) can easily overlook accessibility attributes like `aria-label` for icon-only buttons (`+`, `-`). Screen readers require explicit labels to understand the purpose of these buttons.
**Action:** When adding or modifying interactive elements generated dynamically via JavaScript template literals, explicitly add `aria-label`s to ensure accessibility, ensuring they are correctly localized (e.g., in Spanish).
