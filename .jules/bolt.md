
## 2024-05-30 - Optimize fuzzy search matching overhead
**Learning:** Chained array methods (.map().filter().sort().map()) combined with unmemoized string normalization in inner loop (`scoreProductMatch`) cause massive memory allocation spikes and repeated regex overhead on every keystroke, leading to visual typing lag. Additionally, assigning caching properties directly on mock elements can leak into `Object.keys()` causing unpredictable loop outcomes in other scripts.
**Action:** Replace map/filter chains with pre-allocated arrays populated via single-pass imperative `for` loops. Use `Object.defineProperty(obj, cacheKey, { value, enumerable: false })` to lazily cache normalized data strings securely without breaking iterability.
