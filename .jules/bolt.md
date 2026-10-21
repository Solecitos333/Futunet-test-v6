## 2026-06-17 - [Memoize string normalization in search algorithms]
**Learning:** String normalizations (like removing diacritics using replace/regex and .normalize('NFD')) are expensive and run redundantly for every product field (title, desc, category, brand) during every search stroke/debounced event.
**Action:** Use a `WeakMap` to lazily compute and cache the normalized string of each field per object to reduce redundant regex operations during search filtering, which reduces compute time significantly.
