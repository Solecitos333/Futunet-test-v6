## 2024-05-06 - [Product Search Optimization]
**Learning:** The product search results calculation in `js/catalog.js` used a chained functional approach (`.map().filter().sort().map()`) which creates three intermediate arrays per search query. Given the search is evaluated on every keystroke and product databases can grow, this causes unnecessary garbage collection and performance overhead.
**Action:** Replace the chained array methods with a single imperative `for` loop that performs scoring and filtering in one pass before sorting, reducing memory allocation and improving execution speed.
