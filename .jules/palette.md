## 2026-07-07 - [Add ARIA labels to dynamically generated buttons]
**Learning:** When applying UX or accessibility fixes (like adding `aria-label`s) to dynamically generated HTML components, ensure all conditional view variants (such as 'compact' vs 'regular' layouts) are updated, as they often use separate template literal branches that can cause inconsistent accessibility coverage.
**Action:** Always check all code paths (e.g., `if (compact) {...} else {...}`) within functions generating dynamic HTML components to ensure accessibility attributes are applied uniformly across all variants.
