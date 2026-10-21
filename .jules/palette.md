## 2024-06-17 - Missing ARIA Labels in Dynamic Template Literal Variants
**Learning:** When HTML components are generated dynamically using template literals with multiple visual variants (e.g., 'compact' vs. 'regular' layout branches), accessibility attributes like `aria-label` applied to one variant are frequently missed in the other variants, leading to inconsistent accessibility coverage.
**Action:** Always verify all conditional branches of template literal-based HTML generation when auditing or fixing accessibility to ensure consistent coverage across all view states.
