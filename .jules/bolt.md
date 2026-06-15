## 2024-05-18 - [Optimized Catalog Search Performance]
**Learning:** Repetitive string normalization (which includes NFD normalization and multiple regex replacements) inside search filter loops over `mockDatabase` objects causes poor responsiveness during typeahead search. These expensive operations run redundantly on the same product fields for every keystroke.
**Action:** Implemented lazy memoization using a `WeakMap` (`getNormalized(obj, key)`) to cache the normalized strings, drastically reducing redundant string operations without mutating the source objects.
