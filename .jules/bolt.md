## 2024-05-18 - [Cache normalized strings for faster search]
**Learning:** In frontend performance, caching expensive string normalization (like removing accents and special characters) on static product objects significantly speeds up iterative search loops. Using `Object.defineProperty` with `enumerable: false` ensures these new cache keys don't leak during object serialization or iteration, preventing unexpected side-effects.
**Action:** When optimizing loop performance over static data, consider lazily caching derived values directly on the objects as non-enumerable properties.
