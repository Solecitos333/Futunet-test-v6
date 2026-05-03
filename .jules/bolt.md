## 2024-05-03 - Lazy lowercase caching for search performance
**Learning:** Calling `.toLowerCase()` repeatedly on the same object properties during search filtering (especially on large arrays like `mockDatabase`) causes unnecessary memory allocation and CPU overhead.
**Action:** Use a `getLower(obj, key)` helper that caches the lowercase result using `Object.defineProperty(obj, cacheKey, { value: ..., enumerable: false })` to avoid redundant processing without leaking the new properties into serialization.
