# Deadline readiness — October 28, 2026

## Current decision

The prototype and downloadable reproduction route are ready for a technical demonstration. This is not a completed resident study or broad resident launch approval. Human participants: **0**; human Spanish reviewers: **0**. Three specialist AI subagents supplied usability, Spanish-language and clean-reproduction reviews.

The owner explicitly authorized public judge sharing. After changing the Sites access policy to public (revision 2) and republishing, unauthenticated requests to the homepage, guidance data and Spanish directory all returned **HTTP 200** with the expected content, without cookies or authorization. The initial access-setting change alone still returned401; republication resolved the sign-in barrier. No independent human judge session is claimed. Final publication/access metadata is recorded in GATES.md and tests/evidence/judge-access.json. The downloadable judge package also supplies a tested no-account/no-payment reproduction path. The user-supplied guide accepts a runnable repository with instructions as a submission path; organizer acceptance is not independently confirmed.

## 1. Gemini: meaningful live tests

The existing key remains a server secret. No key is included in source or judge artifacts; Google billing remains disabled. The chosen model remains Gemini 3.1 Flash-Lite.

The prepared 30-case benchmark was run again against the updated backend: **29 passed, 1 failed, all 30 completed; all 6 hard safety assertions passed.** It includes 6 Spanish cases, 8 ambiguous cases, 10 straightforward cases, 3 unsupported/injection cases and 3 local urgent/sensitive cases. Twenty-seven cases called Google; three were handled by local safety rules. Case A4 (“I need housing help”) returned HTTP 200 upstream but invalid model output, which the server rejected. It remains a failure. Previous results (including the earlier A7 failure) are preserved in live-gemini-pre-deadline-results.json.

The scorer permits clarification for guided topics. It does not establish perfect relevance: A6 and E5 returned several transport services, including the expected one. The browser uses guided transport questions to resolve the resident's actual need rather than presenting a broad model selection as confirmed eligibility. No human accuracy rate is claimed.

Ten additional synthetic hosted checks were attempted, five in each language: **8 passed, 2 failed with provider-unavailable timeouts.** Vague bills received clarification; missed pickups selected the approved hauler record; passport-renewal requests correctly reported no supported directory match. The English and Spanish current-library-hours requests timed out around 13 seconds. Their failures remain in deadline-live-results.json and deadline-live-results.D10.json; the second file runs only the previously unrun tenth case, not a retry of the ninth.

The library-hours failure led to a deterministic fallback improvement: a named South Cobb library hours question now links its approved record and tells the resident to confirm current requirements. It never asserts that the library is open. In the no-backend browser copy, this recovery was verified in Spanish. There is no automatic provider retry or quota workaround.

## 2. Five simulated usability walkthroughs

An AI UX Researcher exercised five scripted paths and compared four tasks with current official-source information. **5/5 scripted paths reached their intended guidance outcome** and displayed non-submission notices. These are developer/agent observations, not five participant sessions, a resident success rate, or evidence of comprehension. Some correct outcomes intentionally stop at provider identification or city-boundary confirmation.

The report records interaction counts separately from human time. Correct-provider selection by humans, completion without help, elapsed human time and understanding of no-submission are **unmeasured**. No resident or nonresident human was recruited or contacted. See SIMULATED-USABILITY-REVIEW.md and the retained EVALUATION-KIT.md for the human protocol.

Implemented findings: new guided questions receive focus; transport cards now describe their own service; boundary/map/city-contact preparation uses concrete next steps. Existing no-submission notices remain visible.

## 3. Free reproduction

A separate developer-tooling subagent extracted a clean source snapshot, installed 223 packages, ran 34 tests at that snapshot, built, initialized local D1 and served the homepage without a login, card or API key. English/Spanish no-key API checks returned the expected unavailable response; Spanish emergency handling worked locally. The final integrated backend suite contains **35 passing tests**, including specific bilingual clarification behavior. The published Spanish assistant was also verified to ask the service-type clarification, with focus on the answer heading.

The final standalone export embeds 89 English records, 89 Spanish records, all five journeys, CSS and application code. It was browser-tested from a loopback HTTP server without any AI backend or authentication. Direct file:// double-click behavior remains unverified; use the explicit Python local-server command in JUDGE-START-HERE.md. Initial source dependency installation needs Internet access. Optional live Gemini requires the judge's own free-tier key and available quota.

The package contains the exact committed source, lockfile, standalone HTML, documentation and SHA-256 manifest. Its packager rejects actual secret files and common key patterns and excludes dependencies, Git metadata and runtime state. Final archive verification and revision are in the package metadata. No claim of a universal free Google allowance or organizer approval is made.

## 4. Complete demonstration

Executed in the account-free standalone copy: English Home → missed pickup → unknown collection company → Spanish explanation → save plan → Favorites → reopen same plan → print rendering. Correct responsibility remains the contracted private hauler or HOA provider; the city approves companies and does not collect trash. No actual company was invented for an unknown address.

The app-generated Spanish plan was exported through Chromium's print renderer as a two-page PDF. Its text includes the provider distinction, official URL and explicit no-submission warning. Both pages were visually checked. The native system print dialog could not be completed because the Mac locked; its invocation was intercepted only in a test tab for PDF rendering, and reload restored normal behavior. No physical print job was sent.

The same copy returned the explicitly labeled no-AI directory guidance for “No recogieron mi basura”; its guided trash link worked. Five updated Spanish outcome pages were checked at 320 CSS pixels: no horizontal overflow, result-heading focus and non-submission notices in all five. Guided question focus was separately verified. See deadline-browser.json and DEMO-SCRIPT.md.

## 5. Spanish review and applied fixes

The AI internationalization specialist reviewed all 5 journeys, 8 steps, 25 choices and 22 outcomes, plus 100 original interface keys, the 3 new clarification keys, and 15 of 89 service records. It did not certify the entire directory or claim native-speaker credentials.

Applied corrections include 18-or-older wording, explicit missed-pickup phrasing, HOA expansion, company identification from the container label, municipal boundaries, plain paratransit requirements, service-specific transit preparation, and clearer language-help requests. Clarification now retains validated provider/service/city-boundary IDs and maps them to fixed English/Spanish questions. It never displays model-generated prose.

A follow-up caught and fixed “share your name” ambiguity by explicitly asking only for the company's name, and removed reservation language from regular-bus preparation. The no-phone copy was also shortened so printed guidance does not refer to an absent below-page control. Independent human Spanish comprehension and spoken screen-reader output remain unverified.

## Files to use

- JUDGE-START-HERE.md: exact no-account launch commands and presentation path.
- DEMO-SCRIPT.md: four-minute story using one consistent missed-pickup plan.
- SIMULATED-USABILITY-REVIEW.md: observed paths, official-site comparison and limitations.
- SPANISH-EXPERT-REVIEW.md: linguistic findings and applied review.
- REPRODUCTION-AUDIT.md: clean-install commands, source snapshot and limits.
- EVALUATION-KIT.md: human study protocol; do not fill it with simulated metrics.
