## 2024-07-06 - Fixing ARIA labels in dynamic HTML templates
**Learning:** When fixing accessibility (like adding `aria-label`s) to dynamically generated HTML components, all conditional view variants (such as 'compact' vs 'regular' layouts) must be updated. Often they use separate template literal branches that can cause inconsistent accessibility coverage if only one is updated.
**Action:** Always search for other layout branches within the component generating function to ensure parity across all views.
