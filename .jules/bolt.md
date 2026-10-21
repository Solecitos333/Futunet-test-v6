## 2024-11-20 - Memoize search string normalization using WeakMap
**Learning:** Search performance was suffering due to repeated string normalizations (including heavy regex replacements) on every property of every product on every keystroke. Mutating the objects to cache derived values is risky if objects are frozen.
**Action:** Use a `WeakMap` keyed by the original object to lazily evaluate and cache derived string normalizations (`getNormalized`). This provides massive performance gains in tight loops without mutating the source data structures.
