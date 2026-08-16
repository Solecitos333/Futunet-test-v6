## 2024-05-24 - Add ARIA Labels to Cart Quantity Buttons
**Learning:** Icon-only buttons used for cart quantity adjustments (`-` and `+`) lack accessible names, making them difficult for screen reader users to identify.
**Action:** Always add `aria-label` to icon-only buttons like `-` and `+` during dynamic generation to ensure they are accessible to screen readers.
