## 2024-06-04 - [Missing ARIA Labels on Icon-Only Buttons]
**Learning:** Found dynamically generated icon-only buttons (`+` and `-`) missing `aria-label`s in cart and catalog js rendering logic, hindering screen readers.
**Action:** Always add `aria-label` to dynamically rendered icon-only buttons.
