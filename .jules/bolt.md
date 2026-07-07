## 2024-05-18 - Combine array map and filter operations for search calculation
**Learning:** Chained array operations like `.map().filter().sort().map()` in critical search loops cause multiple redundant allocations of intermediate arrays (especially full-length mapping before filtering).
**Action:** Always combine scoring and filtering into a single imperative loop before sorting to reduce garbage collection overhead and memory usage, particularly when dealing with large datasets like the product database.
