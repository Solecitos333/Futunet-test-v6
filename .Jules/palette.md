## 2024-05-19 - Accessible dynamically generated icon buttons
**Learning:** Dynamically generated HTML components in JavaScript using template literals often lack static analysis coverage for accessibility. In this project, `aria-label` attributes were missing for icon-only buttons (`-` and `+`) used in cart and product quantity controls.
**Action:** Always verify that icon-only or symbol-only interactive elements dynamically generated via string templates include explicit `aria-label` attributes to ensure they are readable by screen readers.
