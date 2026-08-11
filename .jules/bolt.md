## 2024-07-08 - [Optimize search normalization with WeakMap]
**Learning:** During intensive search operations iterating over catalogs, repeated string normalization (Regex replacements, removing accents, etc) dominates processing time and blocks the main thread.
**Action:** Use a `WeakMap` to side-cache normalized values keyed by the original object references (e.g. `product`), retrieving the cached normalized string when available instead of recomputing.
