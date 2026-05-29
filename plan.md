1. Add `getNormalized` helper function to `js/catalog.js` right before `scoreProductMatch`.
2. Update `scoreProductMatch` to use `getNormalized` for title, desc, category, and brand.
3. Update autocomplete logic in `js/catalog.js` to use `getNormalized` instead of `normalizeSearch`.
4. Replace `.map().filter().sort().map()` chains with a single loop in `renderCompactMobileCatalogView` and main search logic in `js/catalog.js`.
5. Update `.jules/bolt.md` with the learning about caching normalized properties and loop performance.
6. Run `node -c js/catalog.js` to verify syntax.
7. Submit the PR with the performance improvement.
