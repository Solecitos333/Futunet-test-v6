## 2024-05-24 - Accessibility on Icon-only Buttons
**Learning:** Found multiple icon-only buttons across catalog (`inline-qty-btn`) and cart checkout flows (`btn-remove-file` and others) lacking `aria-label`. Since the app heavily uses dynamically generated UI with template literals, these are easily missed but critical for screen reader users. The application also uses Spanish for localization.
**Action:** Ensure all dynamically generated icon-only buttons include descriptive `aria-label`s in Spanish.
