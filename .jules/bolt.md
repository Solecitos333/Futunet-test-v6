## 2024-05-24 - Speeding up product search loops
**Learning:** Chained array methods like `.map().filter().sort().map()` create unnecessary intermediate arrays during search filtering. Normalizing strings (accent removal, etc.) on every keystroke for every product is a CPU bottleneck.
**Action:** Use an imperative `for` loop to filter and score in a single pass to reduce memory allocations. Use a `WeakMap` to cache string normalizations keyed by the original product object to avoid redundant string operations without mutating the underlying data structure.
