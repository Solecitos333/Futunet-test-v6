## 2024-05-24 - Lazy String Normalization Caching
**Learning:** Running regex-heavy text normalization (like stripping accents and lowercasing) repeatedly during search filtering on large arrays is a major bottleneck on every keystroke.
**Action:** Use a `getNormalized(obj, key)` helper that caches the normalized string on the object using `Object.defineProperty(obj, cacheKey, { enumerable: false })` to lazily compute it once per item without leaking into iterators/serialization.
