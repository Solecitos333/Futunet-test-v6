
## $(date +%Y-%m-%d) - Cart Item Quantity ARIA Labels
**Learning:** Dynamically generated UI components in template literals (like the cart drawer) are prone to missing basic accessibility attributes. The icon-only '-' and '+' buttons for cart quantities were inaccessible to screen readers.
**Action:** Always proactively search for `<button>` elements within JS template literals that rely on icons or symbols without descriptive text, and ensure they have localized `aria-label`s.
