## 2024-07-06 - Optimize search results calculation in js/catalog.js
**Learning:** Search performance in `js/catalog.js` (within search handlers) is optimized by replacing chained `.map().filter().sort().map()` operations with an imperative `for` loop that performs scoring and filtering in a single pass, reducing intermediate array allocations from three to one.
**Action:** Replace the expensive array chain operations with an imperative for loop for search array manipulations to avoid multiple iterations and unnecessary intermediate array creation.
