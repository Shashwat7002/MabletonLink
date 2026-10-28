# Prototype verification

Verified October 28, 2026, against the local HTTP preview.

## Checks completed

- JavaScript syntax validation passed.
- The bundled directory matches the canonical research JSON exactly: 89 unique services and 15 categories.
- Desktop layout checked at 1440 × 1000, with no horizontal overflow.
- Mobile layout checked at 390 × 844, with no horizontal overflow and visible emergency access.
- Two favorites were added, persisted across reload, and removed; the empty-favorites state rendered correctly.
- All-services pagination displayed 18, 36, 54, 72, then all 89 entries.
- Search for “water bill” returned the water-bill service; unrelated utility results discovered during QA were corrected.
- Search for “garbage” found trash, bulky-item, disposal, and recycling resources.
- An unmatched query displayed the no-results state; clearing filters restored the directory.
- The schools category displayed all 10 matching services.
- Service details displayed the correct agency, applicability, source, and official URL.
- Desktop assistant prompt returned the approved-hauler and bulky-item links with the city/private-hauler distinction.
- Mobile assistant opened, accepted a question, returned the water-service links, and closed.
- Mobile service details opened and closed with Escape.
- No application console errors were observed during functional checks.

## Scope limits

This is a functional static prototype. The assistant uses deterministic directory matching, not a live LLM. Agency logins, applications, payment transactions, and external service availability were not exercised. This is not a formal accessibility conformance audit. Hosted access is independent of the application's lack of SSO.

Preview screenshots are saved locally in the ignored `artifacts/` directory.
