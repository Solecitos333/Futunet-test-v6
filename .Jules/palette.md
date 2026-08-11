## 2026-05-04 - Missing aria-label in dynamically generated icon-only buttons
**Learning:** In `js/catalog.js` (lines 397 and 402), dynamically generated inline cart control buttons with only '+' and '-' icons lack `aria-label` attributes. This is a common pattern where dynamically generated template literals miss accessibility attributes that static HTML has.
**Action:** When working with dynamically generated HTML in JavaScript, explicitly check and ensure `aria-label` attributes are added to icon-only buttons like '-' and '+'.
