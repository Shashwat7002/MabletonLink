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

## Apple-inspired redesign verification — October 28, 2026

- Desktop 1440×1050, tablet 768×1024, phone 390×844, and narrow 320×720 checked through browser UI; no horizontal overflow at these widths.
- Search “water bill” returned one precise match. An unmatched query showed recovery controls.
- Favorites were saved, retained after reload, and removed into the empty state. Existing storage key and IDs are unchanged.
- Utility results retain exact provider names, including Georgia Power, Cobb EMC, Austell Gas System, and Atlanta Gas Light.
- Service details show applicability and official source links. Escape closes the detail and assistant dialogs and restores the opening control’s focus.
- Assistant prompt returned approved private-hauler and bulky-item resources. Its limitations are visible before entering a question.
- At 320×568, assistant Send remained inside the viewport (bottom 515.5px); the conversation has a small scrollable area. A physical phone and on-screen keyboard were not tested.
- A temporary QA server returned HTTP 503 for the first directory request. The error state showed Try again and the official resident guide; retry restored the service links and re-enabled Help.
- Measured narrow-screen targets: Clear search 44×44px; Search 70×46px; Save 87×44px; More information 130×44px.
- Key contrast ratios: ink on canvas 15.46:1; provider text on white 7.91:1; secondary text on canvas 5.40:1; blue actions on white 5.57:1; input border on white 3.62:1.
- No console errors or warnings in the normal preview. The separate failure test deliberately generated a 503.
- UI Designer and UI Finish-Gate Reviewer reviewed actual screenshots and source. Prototype gate passed. Their category-discovery, wrapping, and favorites-search-scope refinements were incorporated.
- No formal screen-reader audit, real-device testing, or full accessibility conformance claim. Narrow reflow was checked; 200% browser zoom was not separately exercised.

## Black-and-white update — October 28, 2026

- Verified at 1440×1050, 768×1024, 390×844, and 320×568 in the in-app browser. No horizontal overflow observed in home, results, and assistant states tested.
- CSS palette contains only #000 and #fff; resolved text colors inspected in the tablet results are black or white. No gradients, shadow effects, or backdrop filters. Foreground/background contrast for the two colors is 21:1.
- Body type is 18px; provider labels are 16px. At 390px: mobile navigation targets are approximately 115×65px, Search 90×50px, Save 98×48px, More information 128×48px. Clear search is 48×48px at 320px.
- Visible search label and explicit Open website, Save/Saved, Close, and Send text verified in the accessibility tree.
- Search for water bill returned one match and updated the persistent polite result announcement. Saving survived reload; removal restored the empty-favorites state. An unmatched query showed recovery; clearing search restored results. Schools filtering produced 10 services.
- Keyboard Tab in service details produced a visible 3px focus outline. Escape closed details and restored More information focus. Escape also closed the assistant.
- At 320×568, the assistant scrolls as one document. New answer starts at y≈130, below the sticky Close control. The question field and Send action were reached and submitted through the UI; a water-bill resource was returned.
- The source directory is byte-identical to the canonical research JSON: all 89 entries retained.
- This pass did not run a live screen reader or actual 200% browser zoom. Narrow reflow and semantic/status inspection are evidence, not full WCAG certification. Physical-device and older-resident usability testing remain useful next steps.


## Accessibility follow-up — October 28, 2026

See [ACCESSIBILITY-REVIEW.md](ACCESSIBILITY-REVIEW.md) for the current scope, findings, fixes, and evidence. This follow-up adds 19 axe-core scan states, native Safari 200% zoom, keyboard focus and modal checks, 320px reflow, text-spacing checks, storage and network recovery tests. All automated scans have zero violations; explicitly listed contrast incompletes received visual review. Actual VoiceOver speech/caption verification remains incomplete because the automation tools could not access its caption window. Browser accessibility trees are not represented as a full screen-reader pass. The earlier limitation about untested 200% zoom is superseded by this follow-up.


## Gemini integration — October 28, 2026

- Added a server-only Gemini 2.5 Flash adapter, approved-record response contract, deterministic prose/links, request limits, same-origin checks, persistent session/network/global quotas and safe failure handling.
- 27 deterministic backend tests passed, including adversarial provider payloads, invalid IDs/extra fields, truncated/blocked replies, quota persistence and concurrent global reservations. These use mock provider responses; they do not measure Gemini routing accuracy.
- TypeScript check and production build passed. Local Cloudflare D1 schema migration applied successfully. The approved 89-record directory is byte-identical to the researched source.
- Browser checks cover missing-key fallback, readable response headings/descriptions, keyboard link access, Browse all services focus, pending/duplicate-send state and 320px reflow. Pending focus was repaired after testing.
- No Gemini key is configured. A live Gemini request, model eligibility, real-model scope evaluation and provider billing are unverified. Setup and evaluation steps are in GEMINI-SETUP.md.
- Existing owner-private Site audience preserved; no application SSO added. Native VoiceOver speech verification is not newly claimed by this work.
