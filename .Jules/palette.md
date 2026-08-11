## 2024-05-24 - Add aria-labels to dynamically generated HTML elements
**Learning:** When using template literals to generate HTML variants (e.g., compact vs regular layouts), accessibility attributes like `aria-label`s on icon-only buttons can easily be missed in one of the branches, causing inconsistent a11y coverage.
**Action:** Always verify that all conditional rendering branches for UI components are updated with the appropriate a11y attributes when adding or fixing accessibility issues in dynamically generated HTML.
