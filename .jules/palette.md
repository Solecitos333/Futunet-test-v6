
## 2026-06-25 - Add ARIA labels to dynamically generated icon-only buttons
**Learning:** Dynamically generated HTML components in vanilla JS template literals (e.g., cart quantity controls and modals) lack static analysis for accessibility, frequently resulting in icon-only buttons missing `aria-label`s.
**Action:** When working on UI components generated via JS template literals, manually audit and explicitly include `aria-label` attributes on any icon-only buttons to ensure they remain accessible.
