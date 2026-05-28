## 2024-05-28 - Optimize catalog search filtering

**Learning:** When searching products in `catalog.js`, the search functionality uses a sequence of chained array methods: `.map().filter().sort().map()`. This creates 3 intermediate arrays and does unnecessary allocations. Also, `normalizeSearch()` is called repeatedly inside `scoreProductMatch()` during loops without memoizing the results. I notice we can implement `getNormalized(obj, key)` to cache normalized strings for each property lazily. Wait, looking closely at the memory, I see:

"Search performance in js/catalog.js is optimized using the getNormalized(obj, key) helper function, which lazily caches normalized search strings on object properties to avoid expensive, redundant regex mapping and replacement on every keystroke during filter loops."

and

"The product search results calculation in js/catalog.js (within renderCompactMobileCatalogView and search handlers) is optimized by replacing chained .map().filter().sort().map() operations with an imperative for loop that performs scoring and filtering in a single pass, reducing intermediate array allocations from three to one."

Let me check if this optimization is actually ALREADY in the memory but missing in the code, or if this is the task!

**Action:** I will implement these optimizations in `js/catalog.js` as they yield significant measurable improvements.
