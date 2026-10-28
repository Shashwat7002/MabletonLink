# Gates: bilingual resident service guidance

Scope: implement the supplied MabletonLink brief, verify software and publish to the existing private Site, with explicit handoffs for external validation.

- [x] G1: Every approved service has English and Spanish navigation and action metadata; five guided journeys resolve only approved service IDs.
  CHECK: node scripts/verify-directory.mjs
  EXPECT: bilingual directory verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output={"services":89,"journeys":5,"terminalPaths":22,"uiStrings":100,"negativeControls":2} | bilingual directory verification passed

- [x] G2: Thirty independently specified routing cases meet the brief's threshold and all hard safety assertions; backend security regression tests pass.
  CHECK: node scripts/verify-routing.mjs
  EXPECT: routing and security verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output=ℹ duration_ms 122.777458 | routing and security verification passed

- [x] G3: Production build succeeds with server-only credentials and a working local API fallback.
  CHECK: node scripts/verify-build.mjs
  EXPECT: production build verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output=Build, six static modules/data files, CSP, no-key API fallback and Spanish emergency verified; secret-detection controls passed. | production build verification passed

- [x] G4: Browser review covers both languages, all five journeys, search, favorites, saved and printable plans, keyboard focus, mobile reflow, and failure recovery.
  EVIDENCE: 2026-10-28 local Chromium/IAB review: 44 bilingual terminal views in tests/evidence/browser-outcomes.json; zero axe violations, heading focus and no desktop overflow. Spanish search/favorites, dialog Escape and focus return, saved/printable plans, 320px reflow, no-key assistant and blocked-directory retry verified. Exact scope and limitations in docs/QA-IMPLEMENTATION.md.

- [x] G5: Source, maintenance, demonstration and evaluation handoff documents exist and distinguish measured results from pending human and live-model validation.
  CHECK: node scripts/verify-handoff.mjs
  EXPECT: handoff verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output=Six handoff documents and 44 recorded browser outcomes checked. | handoff verification passed

- [ ] G6: The exact verified source is deployed successfully to the existing owner-private Site and checked in production.
  EVIDENCE: pending

- [ ] G7: Real Gemini evaluation completes using a user-supplied server secret and current model access.
  EVIDENCE: pending

- [ ] G8: Five to eight resident sessions, independent Spanish review and spoken screen-reader validation are completed; competition no-card/free-tier and public-demo eligibility are verified against the participant guide.
  EVIDENCE: pending

ABANDON: G7 No Gemini key is configured and model access cannot be tested without the user’s secret. Handoff: GEMINI-SETUP.md and scripts/evaluate-gemini.mjs; store the key only as a server secret, then run the synthetic live-model evaluation.
ABANDON: G8 No residents or independent translator participated; spoken screen-reader validation is not established by automated tests. The participant-guide link yielded only a sign-in page, so competition/free-tier/public-demo eligibility cannot be verified. Handoff: docs/EVALUATION-KIT.md and docs/SOURCES.md; arrange human sessions/review and provide the actual participant guide before making these claims.
