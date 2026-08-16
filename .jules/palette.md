## 2024-05-18 - Accessibility on Modal Close Buttons
**Learning:** Icon-only modal close buttons in the admin interface (`class="admin-modal-close"`) lack explicit ARIA labels and are inaccessible to screen readers out of the box, relying only on generic SVG paths.
**Action:** Always ensure any icon-only button components have an explicitly assigned `aria-label` (e.g. `aria-label="Cerrar"`) so screen readers can interpret their function accurately.
