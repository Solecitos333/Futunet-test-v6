## 2024-10-24 - Search Array Allocations Optimization
**Learning:** Chaining array methods `.map().filter().sort().map()` over a large product database array causes multiple intermediate array allocations which can significantly impact UI responsiveness during search-as-you-type filtering.
**Action:** Replace chained array operations in hot loops with imperative `for` loops to process items (score and filter) in a single pass, thereby reducing memory overhead and improving execution speed.
