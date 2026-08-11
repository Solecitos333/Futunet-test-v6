## 2024-05-24 - Lazily Caching Dynamic Normalizations
**Learning:** Using `Object.defineProperty` with `enumerable: false` effectively allows caching of heavy computations (like regex normalizations for search) on dynamic items without leaking properties into standard iterations or JSON serializations.
**Action:** When needing memoization on codebase objects during repeated access operations (like filtering or rendering), consider using `Object.defineProperty` for lazily evaluated caching on the object itself.
