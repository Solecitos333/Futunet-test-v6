## 2025-05-24 - Search Performance Optimization
**Learning:** Frequent calls to `normalizeSearch` during filter/search loops cause significant overhead due to repeated expensive regex and string replacement operations.
**Action:** Implement lazy caching of normalized strings on product objects using `Object.defineProperty` (with `enumerable: false` to avoid leaking into serialization) to avoid redundant calculations.
