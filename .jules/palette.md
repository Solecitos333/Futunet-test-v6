## 2024-05-18 - Dynamically Generated UI Accessibility
**Learning:** Icon-only buttons (like quantity controls +/-, or modal close 'x') that are generated dynamically via JavaScript template strings often lack explicit accessibility labels by default.
**Action:** Always verify that dynamically injected UI components, especially interactive buttons relying only on symbols or icons, include explicit `aria-label` attributes to ensure screen readers provide meaningful context to users.
