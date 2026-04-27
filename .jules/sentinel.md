## 2026-04-27 - [DOM-based escapeHTML Vulnerability]
**Vulnerability:** Found `escapeHTML` implementations using `document.createElement('div').textContent = str; return div.innerHTML;` which fails to escape single and double quotes. This causes XSS vulnerabilities when the output is injected into HTML attributes.
**Learning:** DOM textContent encoding only escapes `<`, `>`, and `&` to their entity equivalents (`&lt;`, `&gt;`, `&amp;`), but does NOT escape quotes (`"` or `'`). If an attribute is formatted like `<a href="${escapeHTML(url)}">`, it can be broken out using double quotes.
**Prevention:** Always use regex-based replacements (e.g. `String(str).replace(/[&<>"']/g, ...)` ) or a trusted encoding library instead of hacky DOM properties when preventing Cross-Site Scripting.
