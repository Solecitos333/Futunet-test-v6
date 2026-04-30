
## 2024-05-18 - Missing ARIA labels in dynamically generated buttons
**Learning:** Icon-only buttons (like `+` and `-` for cart quantity) that are dynamically generated in JavaScript template strings often lack `aria-label` attributes because static HTML analysis tools do not catch them. This presents a major accessibility barrier for screen reader users trying to adjust cart quantities.
**Action:** Always verify that dynamically injected UI components, especially interactive elements like icon-only buttons, have explicitly defined `aria-label`s to ensure they are accessible via screen readers.
