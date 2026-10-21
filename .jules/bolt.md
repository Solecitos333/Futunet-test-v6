
## 2024-05-23 - Search Normalization Caching
**Learning:** Search operations in `js/catalog.js` (both autocomplete and full catalog filter) re-normalized product titles, descriptions, categories, and brands on every keystroke/filter run. Since normalization involves multiple regex replacements and unicode operations, doing it repeatedly for the entire database is expensive.
**Action:** Use a `getNormalized(obj, key)` helper that normalizes the property value once and caches it on the object itself using `Object.defineProperty({enumerable: false})`. This significantly reduces CPU cycles during filtering loops without polluting standard object iteration or serialization.
