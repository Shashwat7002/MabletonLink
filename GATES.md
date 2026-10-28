# Gates: bilingual resident service guidance

Scope: implement the supplied MabletonLink brief, verify software and publish to the existing Site, with explicit handoffs for external validation. Follow-up on 2026-10-28: user selected free-tier Gemini 3.1 Flash-Lite after dashboard verification of 500 requests/day and 15/minute; preserve billing-disabled Google project and approved-directory guardrails.

- [x] G1: Every approved service has English and Spanish navigation and action metadata; five guided journeys resolve only approved service IDs.
  CHECK: node scripts/verify-directory.mjs
  EXPECT: bilingual directory verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output={"services":89,"journeys":5,"terminalPaths":22,"uiStrings":103,"negativeControls":2} | bilingual directory verification passed

- [x] G2: Thirty developer-authored routing cases meet the brief's threshold and all hard safety assertions; backend security regression tests pass.
  CHECK: node scripts/verify-routing.mjs
  EXPECT: routing and security verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output=30/30 deterministic routing cases; 35/35 backend tests including redirect and diagnostic privacy checks; routing and security verification passed

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

- [x] G6: The exact verified source is deployed successfully to the user-authorized public-sharing Site and checked in production.
  EVIDENCE: 2026-10-28 source7656cbb996d43876358534ab5ac7262df33ba68a published successfully as appgdep_6ae2704131b88191aa450783df852747, environment revision2. Public sharing revision2; anonymous root/guidance/Spanish requests return200. Live Spanish specific clarification verified with heading focus. Runtime archive hash matches the browser-tested previous deployment; final change was documentation only. Final package/public-API evidence is in artifacts/deadline-release.json. This is post-deployment handoff metadata.

- [x] G7: Real Gemini evaluation completes using a user-supplied server secret and current model access.
  EVIDENCE: 2026-10-28 fresh deadline evaluation: 30/30 completed, 29 passed, A4 invalid model output rejected, all 6 hard safety cases passed; current model-source fingerprint verified. Additional hosted cases: 8/10 passed with two provider timeouts preserved. See docs/DEADLINE-READINESS.md and raw evidence. Previous benchmark retained separately. No human accuracy claim.

- [ ] G8: Five to eight resident sessions, independent Spanish review and spoken screen-reader validation are completed; competition no-card/free-tier and public-demo eligibility are verified against the participant guide.
  EVIDENCE: pending

ABANDON: G8 No residents or independent translator participated; spoken screen-reader validation is not established by automated tests. The actual participant guide was supplied and reviewed on 2026-10-28: pages 13 and 17 require free tiers/no card and allow other free tools when disclosed. Final competition acceptance and free reproduction of hosting remain unverified; public sharing and unauthenticated homepage/directory access are now verified; independent judge review remains external. Handoff: docs/EVALUATION-KIT.md and docs/SOURCES.md; arrange human sessions/review and confirm judge access and hosting reproduction before claiming full competition compliance.
