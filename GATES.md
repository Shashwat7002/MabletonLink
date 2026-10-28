# Gates: bilingual resident service guidance

Scope: implement the supplied MabletonLink brief, verify software and publish to the existing private Site, with explicit handoffs for external validation. Follow-up on 2026-10-28: user selected free-tier Gemini 3.1 Flash-Lite after dashboard verification of 500 requests/day and 15/minute; preserve billing-disabled Google project and approved-directory guardrails.

- [x] G1: Every approved service has English and Spanish navigation and action metadata; five guided journeys resolve only approved service IDs.
  CHECK: node scripts/verify-directory.mjs
  EXPECT: bilingual directory verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output={"services":89,"journeys":5,"terminalPaths":22,"uiStrings":100,"negativeControls":2} | bilingual directory verification passed

- [x] G2: Thirty developer-authored routing cases meet the brief's threshold and all hard safety assertions; backend security regression tests pass.
  CHECK: node scripts/verify-routing.mjs
  EXPECT: routing and security verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/shashwatchoudhary/Developer/MabletonLink; path=7797410660e3/21 entries; output=ℹ duration_ms 125.515167 | routing and security verification passed

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
  EVIDENCE: 2026-10-28 deployment appgdep_6ae267819e448191845f6cbad992355e succeeded for source 452e0c93a6e2164aff77b687f6d10f3f5980ed8c, environment revision 1. Key remains a hosted secret and audience remains owner-private. Production browser verified English switch, quota-unavailable fallback selecting Pay a water bill, and its approved Cobb County payment URL/phone/next-step card; heading focus moved to the response and service details. Screenshot: artifacts/gemini-quota-fallback.png. This post-deployment evidence is local handoff metadata; application source matches the published commit.

- [x] G7: Real Gemini evaluation completes using a user-supplied server secret and current model access.
  EVIDENCE: 2026-10-28 live Gemini 3.1 Flash-Lite evaluation completed 30/30 cases, exit 0: 29 pass, one rejected-model-output failure (A7), all six hard safety assertions pass. Includes 26 passing model decisions plus three local safety decisions; two transient provider failures retained in attempt history. Independent recomputation verifies all case IDs, canonical service IDs, 27/30 threshold and exact evaluated-source fingerprint. Free tier with 15 requests/minute and 500/day verified in the matching Google project. See docs/FREE-TIER-CONFIGURATION.md and tests/evidence/live-gemini-results.json; no claim of perfect routing or human usability.

- [ ] G8: Five to eight resident sessions, independent Spanish review and spoken screen-reader validation are completed; competition no-card/free-tier and public-demo eligibility are verified against the participant guide.
  EVIDENCE: pending

ABANDON: G8 No residents or independent translator participated; spoken screen-reader validation is not established by automated tests. The actual participant guide was supplied and reviewed on 2026-10-28: pages 13 and 17 require free tiers/no card and allow other free tools when disclosed. Final competition acceptance and free reproduction of hosting remain unverified; existing Site remains owner-private. Handoff: docs/EVALUATION-KIT.md and docs/SOURCES.md; arrange human sessions/review and confirm judge access and hosting reproduction before claiming full competition compliance.
