## 2024-05-20 - Memoization of Normalized Search Strings

**Learning:** Search operations on large arrays like `mockDatabase` frequently call `normalizeSearch` which performs expensive regex operations and allocations. Normalizing the same object properties (e.g. `p.title`, `p.category`) repeatedly in a loop or across keypress events during filtering causes unnecessary overhead and GC churn.

**Action:** Lazily cache normalized values using a `WeakMap` associated with each object (e.g., via a `getNormalized(obj, key)` helper) to ensure `normalizeSearch` is only executed once per property per object over the application's lifecycle, without permanently mutating the original objects. Also replace chained array methods like `.map().filter().sort().map()` with a single imperative loop to avoid unnecessary array allocations in hot paths like search.
