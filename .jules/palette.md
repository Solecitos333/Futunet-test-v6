## 2024-05-24 - Accessibility for Dynamically Generated UI Controls
**Learning:** Dynamically generated HTML components within template literals in JS lack static analysis coverage for accessibility. Elements like icon/symbol-only buttons (`-` and `+` for quantity) often miss critical ARIA labels, creating poor experiences for screen readers.
**Action:** When working on dynamic HTML generation (e.g., in vanilla JS rendering), always proactively review and manually enforce ARIA attributes (`aria-label`) for interactive elements that lack text content.
