## 2024-05-24 - Missing ARIA labels in dynamic templates
**Learning:** In projects that dynamically generate HTML using JavaScript template literals, icon-only buttons (like quantity +/- buttons) frequently lack `aria-label`s, breaking accessibility.
**Action:** When working on UX/a11y tasks, always look out for string literal HTML definitions and add explicit `aria-label` attributes to any icon-only elements generated there.
