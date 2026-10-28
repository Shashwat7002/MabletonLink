# Four-minute demonstration

Use synthetic questions only. Start at Home with English selected. Keep the approved source dates visible when relevant. Use GEMINI-ACTIVATION.md to distinguish successful live Gemini responses from quota/unavailable fallbacks.

**0:00–0:30 — Resident problem.** “Mableton services are provided by different organizations. This page helps a resident find who to contact, what to prepare and what to do next. It is an independent prototype.” Show five topics, readable text, search and the language control.

**0:30–1:20 — Missed trash collection.** Choose Trash pickup → regular pickup missed → not sure who collects it. Explain bill/cart/HOA identification and the difference between private collection and the city's approval role. Open sources. Do not submit an external form.

**1:20–2:10 — Spanish and access.** Switch to Español; show the same content remains in Spanish. Open Ayuda para usar servicios en línea → printing/scanning. Show library phone and address, preparation and the instruction to check fees. Explain that external sites may still be English-only and independent translation review is pending.

**2:10–2:40 — Save and print.** Save that plan, open Favorites / Favoritos, and reopen it. Show Print or save as PDF. “This is a plan, not proof that an agency received a request.” The plan contains official sources and no resident question or personal details.

**2:40–3:20 — Assistant and resilience.** Ask “Can I use CobbLinc Go from my neighborhood?” When quota is available, show the live suggestion and follow the guided coverage check. If the provider is unavailable, identify the explicitly labeled directory fallback accurately. Show that a general bill question gets clarification instead of a guessed provider.

**3:20–4:00 — Evidence and limits.** Show the saved routing report: 30 synthetic cases and backend security checks. Explain that developer-authored regression results do not establish resident usability or live-model accuracy. Show the evaluation kit, maintenance owner proposal and key setup instructions. State that the current deployment is private; public-access and competition requirements still require verification.

## Repeatable setup

Run `node scripts/verify-directory.mjs`, `node scripts/verify-routing.mjs`, then `node scripts/verify-build.mjs`. For a local demo, run `npm start -- --port 4177`. An offline HTML export is generated with `python3 scripts/export-standalone.py`; it includes the directory and guided flows, while official websites and Gemini require a network connection. Offline does not mean that a fresh visit to the hosted Site works without downloading assets first.

Never demonstrate real emergency calls, actual benefit applications, real account data, payments or report submission.
