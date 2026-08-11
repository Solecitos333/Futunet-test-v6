## 2024-05-20 - Add ARIA labels to modal close buttons
**Learning:** Found multiple modal close buttons in `admin.html` that only contain an SVG icon without any accessible text. This is a common accessibility issue for screen reader users.
**Action:** Added `aria-label="Cerrar"` to all `<button class="admin-modal-close">` elements to ensure they are properly identified by screen readers. Next time, always check icon-only buttons for `aria-label` or visually hidden text.
