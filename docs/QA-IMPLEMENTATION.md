# Implementation evidence — 2026-10-28

This is the original pre-activation report. See GEMINI-ACTIVATION.md for the historical 2.5 activation and schema fix; see FREE-TIER-CONFIGURATION.md for the subsequent 3.1 Flash-Lite selection, backend security suite, participant-guide review and current live evaluation.

This report covers the bilingual guided-service implementation, superseding earlier interface-specific assertions in the historical root accessibility report. It is not WCAG certification, an independent translation review or a resident study.

## Automated checks

- 89 unique approved HTTPS service records, complete Spanish title/description/applicability fields, 15 categories and paired action metadata.
- Five guided journeys and 22 reachable terminal paths; no cycles, missing outcomes or unknown service references. Missing-translation and invented-ID negative controls are rejected.
- 30 developer-authored synthetic routing cases: 10 straightforward, 8 ambiguous, 6 Spanish, 3 unsupported/outside-area and 3 sensitive/urgent. Final deterministic routing result: 30/30. Initial result: 29/30; “property taxes” plural was not recognized, so the router was corrected and rerun. This is regression testing, not a held-out evaluation or live Gemini measurement.
- 30 backend tests pass: schema and approved-record constraints, malicious extra fields/URLs, blocked/malformed/oversized output, origin and body bounds, key absence, persistent quotas, concurrent global limits, provider failure, bilingual emergency/sensitive cases and sensitive prior-context suppression.
- Production build and local HTTP checks verify nonempty JS/data assets, CSP, no-key 503 fallback and Spanish emergency response. Client artifact scanning includes positive controls for leaked-key detection.
- axe-core 4.14.0: all 44 English/Spanish terminal outcome views checked against WCAG 2 A/AA and 2.1 AA tags; zero reported violations. Dialog scan also returned zero. Results are in `tests/evidence/browser-outcomes.json`.

## Browser checks performed

- English and Spanish home navigation, guided missed-pickup choices and provider distinction.
- All 22 outcome screens in both languages: correct headings, focus moved to the page heading, no horizontal overflow at the desktop test width.
- 320 CSS-pixel reflow on home, all services, housing question, paratransit result, library access result and favorites. No horizontal overflow detected. Mobile display inspected at 390 CSS pixels.
- Spanish “factura agua” search finds the water bill, favorites toggle reports state, details use a named native dialog, Escape closes it and restores focus to the invoking button.
- Spanish missed-pickup plan saves, reopens through Favorites and produces printable content with provider distinctions, sources, dates and explicit no-submission wording. Print-preview media inspected. The browser's system print invocation was intercepted only during testing; no physical print job was sent.
- Assistant with no key returns a labeled directory fallback and a relevant guided journey. Response heading receives focus.
- Blocking the Spanish directory file produces a Spanish error with an official resident-guide link. Removing the block and choosing retry restores the directory and heading focus. Test-only interception and emulation are removed by reset/reload.

## Review passes and defects fixed

Implementation pass added data, navigation, guidance, saved plans, printing and bilingual assistant behavior. Expert reread found sensitive prior context could be forwarded after an input warning; both client and server now suppress it. Defect hunt found root URLs defaulted to All services, plural property taxes missed routing, page action headings skipped a level, result announcements could remain stale, and an old timer could abort a later request; all were corrected. Polish added singular result wording, visible saved-plan status, source-backed water customer service, and safety-specific messaging that does not falsely imply AI was attempted.

## External work still pending

No real Gemini key or model invocation was used. Independent Spanish review and 5–8 resident sessions were not conducted. Actual spoken VoiceOver/NVDA validation remains pending; the accessibility tree and automated checks cannot establish pronunciation or real assistive-technology usability. The participant guide was inaccessible beyond a sign-in page, so competition and free-tier/no-card eligibility are unverified. The Site audience remains private.

## Deadline follow-up

See DEADLINE-READINESS.md for the newer language, focus, transport, model and judge-access work. This report remains the historical pre-activation snapshot; its private-access and pending-model statements do not describe the later release.
