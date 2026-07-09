## 2024-07-02 - Inconsistent ARIA Label Coverage in Dynamic Components
**Learning:** When applying accessibility attributes like `aria-label`s to dynamically generated HTML components (such as those using template literals), there can often be inconsistent coverage across conditional view variants (e.g., 'compact' vs 'regular' layouts).
**Action:** When auditing or adding `aria-label`s, ensure to check all conditional branches or variants of a UI component so no element is left inaccessible.
