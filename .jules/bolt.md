## 2024-07-02 - Optimize search input loops with WeakMap

**Learning:** When performing string sanitization (`normalizeSearch`) on deeply nested or dynamic properties within a continuously firing loop (such as a search filter), the cost of text encoding replacement and RegExp processing dominates. Chaining array prototype functions like `.map().filter().sort().map()` further worsens performance due to array reallocation.

**Action:** Instead of mutating original objects, or repeating string conversions on every input, use `WeakMap` to store side-cache representations of object properties dynamically. Also, collapse `map().filter().sort().map()` sequences into a single `for` loop pass using a side array to track state (`{ product, score }`) directly, finally extracting it to minimize GC thrashing.
