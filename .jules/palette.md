## 2026-05-28 - Added missing ARIA labels to cart/quantity icon buttons
**Learning:** Dynamically generated HTML components in JavaScript (like the cart and product quantity controls) lacked ARIA labels on icon-only `-` and `+` buttons, making them inaccessible to screen readers.
**Action:** Add ARIA labels (in Spanish, matching the application's localization) to these icon-only buttons during dynamic generation.
