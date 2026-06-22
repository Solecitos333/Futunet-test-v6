
## 2026-06-22 - Inconsistent Accessibility in Dynamic Components
**Learning:** Dynamically generated HTML components (like cart controls and modal buttons via template literals) often lack proper accessibility attributes compared to static HTML, especially across conditional view variants (e.g., 'compact' vs. 'regular' views).
**Action:** Always verify accessibility attributes (like `aria-label`) when adding or modifying dynamically generated components, and ensure all conditional view variants are equally accessible.
