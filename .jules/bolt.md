## 2024-05-24 - Search Performance Optimization
**Learning:** Normalizing search strings using `normalize('NFD')` and regex on every keystroke for every product property is a major CPU bottleneck during search filtering. Directly assigning cached values to product objects can cause serialization issues.
**Action:** Use `Object.defineProperty` with `enumerable: false` to lazily cache normalized strings directly on the product objects to bypass expensive normalizations without breaking object iteration.
