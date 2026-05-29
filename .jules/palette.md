## 2025-05-29 - Dynamically Generated HTML Component Accessibility Attributes
**Learning:** Dynamically generated HTML components using template literals in vanilla JavaScript (e.g., cart and product quantity controls) often miss static analysis coverage for accessibility, leading to missing `aria-label` attributes on icon-only buttons.
**Action:** When updating or generating new dynamic UI components with template literals, explicitly add `aria-label` attributes to icon-only buttons to ensure keyboard and screen-reader accessibility.
