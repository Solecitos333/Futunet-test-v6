## 2024-05-25 - [Optimize Array Operations for Product Scoring]
**Learning:** Chained array operations like `.map().filter().sort().map()` create unnecessary intermediate arrays, increasing memory allocations and garbage collection overhead. In a high-frequency search filtering function handling large datasets, this can cause significant performance bottlenecks.
**Action:** Replace chained array operations with imperative `for` loops to perform filtering and scoring in a single pass, thus reducing allocations from three intermediate arrays down to one.
