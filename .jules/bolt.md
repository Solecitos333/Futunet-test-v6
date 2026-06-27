## 2024-06-27 - Memoize normalized search strings with WeakMap

**Learning:** Search performance in `js/catalog.js` suffers because `normalizeSearch` (which uses multiple slow regex replacements and `.normalize('NFD')`) is called on every product property during every keystroke/filter loop. The global memory instructs us to optimize this using a `WeakMap` instead of mutating the source objects (to avoid TypeErrors if objects are frozen and keep objects clean).

**Action:** Created `getNormalized(obj, key)` helper function that lazily caches normalized search strings using a `WeakMap` and replaced all redundant `normalizeSearch` calls on objects within loops with this new optimized helper function. This single pass reduction avoids 3 intermediate array allocations and redundant calculations.
