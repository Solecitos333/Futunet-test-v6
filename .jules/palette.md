## 2024-05-24 - Accessibility for dynamic components
**Learning:** Dynamically generated HTML components in JavaScript (like cart quantity controls and modals) lack static analysis coverage for accessibility.
**Action:** Ensure `aria-label` attributes are explicitly added to icon-only buttons (like `-`, `+`, and `&times;`) during dynamic template generation.
