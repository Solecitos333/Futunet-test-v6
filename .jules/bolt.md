## 2024-05-24 - Optimize Product Search and Filtering
**Learning:** Chained array methods (`.map().filter().sort().map()`) create multiple intermediate arrays which degrades performance during high frequency search filtering. Additionally, repeated string normalization operations in search algorithms cause significant bottlenecks if not cached.
**Action:** Replace chained array methods with a single imperative `for` loop to filter and score in one pass. Use `Object.defineProperty` to cache string normalization directly on product objects without leaking new keys during enumeration.
