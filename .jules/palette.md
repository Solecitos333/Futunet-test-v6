## 2024-05-24 - Init\n**Learning:** Initial Palette journal entry.\n**Action:** Started adding insights.

## 2024-05-24 - Accessibility in dynamic templates
**Learning:** Dynamically generated HTML components using template literals (e.g., inline-cart controls) often miss accessibility attributes like `aria-label` on icon-only buttons because they bypass static analysis tools. Also, conditional view variants (such as 'compact' vs 'regular' layouts) might use separate template literal branches leading to inconsistent accessibility coverage.
**Action:** When adding or verifying accessibility attributes, search and review all string templates where the target element is generated, ensuring all conditional variants are updated consistently.
