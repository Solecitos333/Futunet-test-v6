## 2024-05-24 - Add ARIA Labels to Cart Quantity Buttons
**Learning:** In Futunet's dynamic UI components built with JS template literals, accessibility properties like `aria-label` are often omitted on icon-only buttons (like `+` and `-` in the cart and catalog quantity controls), resulting in poor screen reader experiences.
**Action:** Always check dynamically generated HTML templates in JS files for accessibility attributes, especially on elements with only icon children.
