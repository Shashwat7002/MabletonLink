# MabletonLink LaunchPad

Source repository: [Shashwat7002/MabletonLink](https://github.com/Shashwat7002/MabletonLink). The public Vercel deployment serves the directory and a same-origin assistant gateway. [Deployment architecture and instructions](docs/PUBLIC-DEPLOYMENT.md).

An accessible black-and-white resident directory with 89 approved links in 15 categories, search, browser-local favorites and a server-side Gemini service-routing assistant. No application sign-in or SSO was added. The owner enabled public sharing for judges on October 28, 2026; logged-out homepage and directory access were verified after republication without cookies or authorization. Use the downloadable no-account reproduction path in docs/JUDGE-START-HERE.md.

The interface remains plain HTML/CSS/JavaScript. Vinext/Cloudflare Workers supplies `/api/assistant`; D1 stores only usage counters. The assistant defaults to Gemini 3.1 Flash-Lite, selected by the owner for its larger verified free-tier allowance. The hosted key is a server secret. See [GEMINI-SETUP.md](GEMINI-SETUP.md) and [the free-tier review](docs/FREE-TIER-CONFIGURATION.md) for configuration, quotas and limitations.

## Source

- `public/index.html`, `public/styles.css`, `public/app.js`: accessible interface and browser behavior.
- `public/services.json`: canonical approved knowledge used by both browser and server.
- `server/policy.mjs`: Mableton-only system instructions and output schema.
- `server/assistant.mjs`: request/output validation, provider call, fixed replies, cookies and shared usage limits.
- `app/api/assistant/route.ts`: backend route; `app/route.ts`: HTML response.
- `db/schema.ts` and `drizzle/`: usage counter schema/migrations.
- `tests/assistant.test.mjs`: deterministic security and failure-path tests.
- `tests/routing-benchmark.json`: 30-case prepared live-model benchmark; `tests/deadline-live-cases.json`: additional bilingual hosted checks.
- `.openai/hosting.json`: Site identity and runtime bindings. Secrets belong in runtime settings.
- `dist/`: generated deployment output. Do not edit it.

## Development

Use the Sites install/build workflow, or `npm run install:ci`, `npm test`, `npm run build`, and `npm run start`. See setup instructions for local D1 initialization and ignored `.dev.vars` secrets. `npm run dev` is available for development.

To update knowledge, revise the researched `../mableton-service-directory.json`, copy it to `public/services.json`, review the changes, test and deploy. Keep IDs stable for favorites. Current research date: October 28, 2026. No account/transaction flows on external providers have been tested.

Run `python3 scripts/export-standalone.py` for the offline directory export. Offline browsing/favorites work; the Gemini assistant needs the hosted backend and provides a directory fallback offline.

The assistant selects approved records; it does not answer arbitrary questions, invent policy details, access accounts or take actions. Model relevance is probabilistic and needs real-key evaluation. User questions are not persisted by the application.

`ACCESSIBILITY-REVIEW.md` records prior keyboard/AX/zoom checks and the limits of native VoiceOver verification. `DESIGN-CONTRACT.md` records the simple monochrome design.

## Bilingual guided-service implementation (2026-10-28)

The app now includes English/Spanish navigation and 89 translated service records, five guided journeys with 22 outcomes, consistent provider/authority/next-step cards, access-help alternatives, local saved plans and printing. No SSO. No form submission or ticket tracking is implied.

- `public/guidance.json`: paired action metadata, verified contacts and journey graph.
- `public/services.es.json` and `public/i18n.mjs`: service and interface translations.
- `public/routing.mjs`: conservative deterministic routing/search fallback.
- `docs/`: two-page brief, sources, maintenance, demo and evaluation handoffs.
- `GATES.md`: Unlazy completion ledger and external validation limits.

Run `node scripts/verify-directory.mjs`, `node scripts/verify-routing.mjs`, `node scripts/verify-build.mjs`, and `node scripts/verify-handoff.mjs`. Generate the standalone directory with `python3 scripts/export-standalone.py` (output in ignored `artifacts/`). A fresh offline visit to the hosted Site is not supported; the exported file includes its data.

Active working copy: `/Users/shashwatchoudhary/Developer/MabletonLink`. The original Documents checkout was preserved because cloud-backed files repeatedly timed out. Do not edit both copies concurrently.

## Judge handoff

See `docs/JUDGE-START-HERE.md` and `docs/DEADLINE-READINESS.md` for the tested free reproduction path, exact demonstration and honest evaluation limits. AI specialist reviews are documented separately from human participants.
