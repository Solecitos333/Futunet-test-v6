## 2024-06-27 - Dynamically Generated UI Accessibility
**Learning:** Dynamically generated HTML components using template literals in JavaScript lack static analysis coverage for accessibility, leading to inconsistent `aria-label` coverage on icon-only buttons (like `-` and `+`), especially across conditional view variants (e.g., "compact" vs "regular" layouts).
**Action:** When adding or updating dynamically generated UI, ensure all conditional template literal branches are updated, and explicitly add `aria-label` attributes to all icon-only buttons.
