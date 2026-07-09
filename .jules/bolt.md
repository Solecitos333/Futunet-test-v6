
## $(date +%Y-%m-%d) - [Lazily caching normalized search strings]
**Learning:** String normalization (removing accents, lowercase, regex replacements) in hot loops like search filtering can be a major performance bottleneck. Caching these normalized strings directly on product objects dramatically speeds up search. Using `Object.defineProperty` with `enumerable: false` allows adding these cached properties without them leaking into serialization operations (like `JSON.stringify`) or iteration loops (`Object.keys`), preventing unexpected side effects.
**Action:** When caching computed data on objects used elsewhere in the application, use `Object.defineProperty` with `enumerable: false` to ensure the cache mechanism is transparent and doesn't pollute the object's visible data structure.
