## 2026-06-10 - ARIA Labels in Conditional Template Literals
**Learning:** When applying accessibility fixes (like `aria-label`s) to dynamically generated HTML components, ensuring that all conditional view variants (such as 'compact' vs 'regular' layouts) are covered is critical, as they often use separate template literal branches. Missing these can result in incomplete accessibility coverage.
**Action:** Always check for and apply accessibility improvements to all conditional rendering branches of a UI component, not just the default or currently active view.
