## 2024-05-04 - Caching normalizeSearch
**Learning:** Calling `normalizeSearch()` inside a loop iterating over `mockDatabase` results in a significant performance hit.
**Action:** Use a `getLower` function to dynamically cache the output of `normalizeSearch` to properties to optimize performance. Use `Object.defineProperty` so it's not enumerable and doesn't pollute serialization.
