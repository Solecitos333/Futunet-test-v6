## 2026-04-28 - DOM XSS in Home Showcase Cards
**Vulnerability:** DOM Cross-Site Scripting (XSS) in `js/home_showcase.js` due to unescaped user-controlled product properties (`title`, `meta`, `price`, `img`) being directly injected into HTML templates via `innerHTML`.
**Learning:** The DOM-based `escapeHTML` implementation (using `textContent` then reading `innerHTML`) is flawed as it does not escape quotes (`"` and `'`), allowing attribute injection.
**Prevention:** Use a robust, regex-based `escapeHTML` function that replaces `&`, `<`, `>`, `"`, and `'` with their respective HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`). Always escape untrusted variables before interpolating them into HTML templates when using `innerHTML`.
