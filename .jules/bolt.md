## 2024-05-01 - Optimize property `.toLowerCase()` in tight search loops
**Learning:** Calling `.toLowerCase()` repeatedly on the same strings during search filtering (especially across large product catalogs) is a hidden performance bottleneck.
**Action:** Implemented a `getLower(obj, key)` helper that caches the lowercase result of a property directly on the object (as `_lower_key`) upon first read. Use this pattern for frequently filtered properties in loops to avoid redundant allocations and slow string operations.
