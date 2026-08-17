## 2025-02-12 - Missing ARIA Labels on Dynamically Generated Buttons
**Learning:** Icon-only buttons or buttons using simple text characters (like "-" or "+") generated dynamically in JavaScript template literals often lack `aria-label` attributes for accessibility.
**Action:** When adding or modifying interactive UI components rendered via JS template strings, explicitly verify and add `aria-label` to icon-only buttons (like quantity minus/plus or close buttons).
