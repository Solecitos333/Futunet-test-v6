## 2024-07-06 - [Lazy Caching of Normalized Search Strings]
**Learning:** Normalizing search strings (using NFD, regex replacements, etc.) is computationally expensive when executed repetitively in filter loops (like filtering `mockDatabase` on every keystroke). Mutating the source objects directly is a bad practice.
**Action:** Use a `WeakMap` to side-cache the expensive string normalization results keyed by the product object reference. This avoids mutating the source while significantly improving search performance by running normalization only once per property per object.
