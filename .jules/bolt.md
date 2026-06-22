## 2024-06-22 - Optimize search results calculation in catalog
**Learning:** In frontend JS without a build step, chaining `.map().filter().sort().map()` over a large array (like a product database) creates multiple intermediate arrays, causing significant memory allocation overhead and main thread blocking during search keyup events.
**Action:** When filtering and mapping large datasets for search, replace chained array methods with a single imperative `for` loop that performs mapping and filtering in one pass before sorting to improve performance and responsiveness.
