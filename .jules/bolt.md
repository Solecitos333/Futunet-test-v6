## 2024-05-15 - [Initial performance exploration]
## 2026-06-28 - [WeakMap for Search Normalization Cache]
**Learning:** In highly repetitive filtering loops (like catalog search), repeatedly calling string manipulation functions (regex, normalization) on the same dataset properties causes significant overhead. However, `mockDatabase` is dynamically modified.
**Action:** Use a `WeakMap` keyed by the object reference to cache derived values (like normalized strings) without mutating the objects. This improves search performance while naturally handling dynamic insertions or garbage collection without requiring manual cache invalidation logic.
