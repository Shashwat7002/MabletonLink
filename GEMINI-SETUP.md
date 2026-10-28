# Connect Gemini to MabletonLink

The integration is implemented. Without a runtime key it safely returns an unavailable message while search, categories and favorites keep working. No key is embedded in the site. The owner selected Gemini 3.1 Flash-Lite on 2026-10-28 to use its larger free-tier allowance. The hosted key is stored as a secret; it is not in the repository. See docs/FREE-TIER-CONFIGURATION.md for current results and docs/GEMINI-ACTIVATION.md for the historical 2.5 activation.

## Get or find your key

1. Open [Google AI Studio API keys](https://aistudio.google.com/api-keys) and sign in to your Google account.
2. Select or create a Google Cloud project for MabletonLink, then create a key. If an existing project is missing, import it from AI Studio → Dashboard → Projects first.
3. Copy the key privately. New AI Studio keys are authorization keys restricted to the Gemini API. Never paste the key into a chat message, source file, frontend setting, or public repository.
4. For this challenge prototype, keep the project on Free tier with billing disabled. Use public/synthetic content only, following the supplied participant guide. A future resident deployment needs a separate data-use and provider-terms review; adding billing is not part of this setup.

Official instructions: https://ai.google.dev/gemini-api/docs/api-key

## Configure the hosted Site

Open this Site's Settings and its production environment-variable controls. Set:

| Name | Value |
| --- | --- |
| `GEMINI_API_KEY` | Your private key |
| `GEMINI_MODEL` | `gemini-3.1-flash-lite` |
| `ASSISTANT_DAILY_LIMIT` | `500` (site-wide maximum API attempts per UTC day) |
| `ASSISTANT_ENABLED` | `true` (`false` immediately disables new provider calls after deployment) |

Save the environment variables, then redeploy the latest saved Site version. Sites applies changed runtime values on deployment; editing a local environment file does not configure the published site. Keep the existing private audience for the initial real-key checks. If the environment editor is unavailable in your UI, store the key in the ignored local `.dev.vars` file described below and ask Codex to transfer that value to this Site's runtime without printing it.

Current Site: https://mabletonlink-launchpad.himanshu-k-cd.chatgpt.site

This project's AI Studio dashboard showed Gemini 3.1 Flash-Lite at 15 requests/minute, 250,000 input tokens/minute and 500 requests/day on Free tier. Gemini 2.5 Flash was 5/minute and 20/day; 2.5 Flash-Lite was 10/minute and 20/day. These are observed account-specific limits, not guaranteed universal allowances. Other applications using the same Google project share its quota. There is no unlimited-free setting, and an application cap cannot increase Google's quota. Google resets daily quota at midnight Pacific; the application cap uses UTC. No automatic model substitution occurs.

Availability: https://ai.google.dev/gemini-api/docs/deprecations

## Local development

Copy `.env.example` to `.dev.vars`, enter the key locally, and keep this file untracked. The provided `.gitignore` excludes local environment/secret files. Do not put any secret in `public/` or use `VITE_` / `NEXT_PUBLIC_` prefixes.

```sh
npm run install:ci
npm test
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_premium_ben_urich.sql
npm run start
```

Apply that migration only once to a fresh local database. Hosted publishing applies migrations separately. The maintained Sites installer/build helpers are preferred when working through Codex.

## What the guardrails enforce

- The server uses the reviewed `public/services.json` (89 records). The browser cannot replace the system instruction, directory, model, tools or generation settings.
- Gemini returns only `status`, up to three approved `service_ids`, and an approved `clarification_id`. The server validates combinations, IDs, uniqueness and the absence of extra properties.
- The server constructs all resident-facing text and URLs from fixed templates and approved records. No generated prose, model-provided URL, HTML, code or tool call is displayed or executed.
- The system instruction in `server/policy.mjs` limits intent matching to services for Mableton residents, including relevant county/state/school/utility/community services. Mere mention of Mableton does not make a request relevant.
- These controls constrain the content, but do not prove that every selected service is relevant. Real-model routing evaluation remains required after configuration.
- No account access, payment, form submission, browsing or action tools. Harm filters remain enabled. Emergency notices cannot dispatch help.
- Requests are same-origin JSON, limited to 8 KiB, with a 500-character question and at most one previous question / three previous service IDs. Extra fields are rejected.
- D1 enforces 20 attempts per session/hour and 60 per network/hour. The hosted site-wide cap is configured to 500/day; the code's conservative default is 200 if no value is supplied. The global cap is configurable from 1 to 5000. Counters are atomic and shared across Worker instances. Provider failures consume a reservation; there is no automatic retry.
- Signed HttpOnly, SameSite=Strict session cookies; Secure on HTTPS. Rotating browser cookies does not remove network/global limits. Without a platform IP, a conservative shared network bucket is used. No claim that CORS is authentication.
- Provider timeout 12 seconds, browser timeout 15 seconds, bounded response size and 1024 maximum output tokens. No model selection from client input. Gemini 3.1 Flash-Lite uses Google's recommended temperature 1 and minimal thinking; explicit 2.5 Flash rollback retains temperature 0 and a zero thinking budget. The server validates all output regardless of generation settings. The GenerateContent structured-output schema constrains shape; the authoritative service allowlist stays on the server.
- Quotas are request caps, not a currency guarantee. Set provider budgets/alerts and account quotas too; Google budget alerts are not necessarily hard spending stops.
- No application logging of prompts, answers, raw IPs or keys. D1 holds usage counters, signed-session identifiers and a daily HMAC of the network address, not conversation content. Expired counters are purged on later configured requests after two days; if traffic stops, expired rows remain until the next request. Hosting/provider logs have their own policies.
- Google receives the current question, limited follow-up context, approved directory and policy. Favorites are not sent. Conversation text stays in page memory and is cleared by “Start a new question” or reloading.

## Before enabling for residents

Run `npm test`, then run `node --env-file=.dev.vars scripts/evaluate-gemini.mjs` with your configured key. This runs the 30-case synthetic benchmark, with 27 potential provider requests and three local safety decisions. It prints decision summaries and writes credential-free evidence. Calls are paced 4.5 seconds apart for 3.1 Flash-Lite, or 13.5 seconds for other models; `GEMINI_EVAL_DELAY_MS` can override this for a verified project quota. The evaluator stops on unavailable responses and never counts unrun cases as passes. After quota recovery, append `--resume` to retain completed responses and retry only unavailable/unrun cases; changed model or evaluation inputs invalidate the checkpoint. Use `--check-resume` without a key to inspect the checkpoint. Prior 2.5 results are preserved separately in tests/evidence/live-gemini-2.5-results.json. Legacy cases in tests/gemini-evaluation.json remain available for additional manual review. Confirm the resulting official links, not just valid JSON. Include water bills, trash, school assignment, vague questions, unsupported fees, unrelated requests, prompt injection and follow-up ambiguity. Inspect blocked/model-unavailable failures in AI Studio without logging residents' private text.

The owner authorized public sharing for judges on October 28, 2026. The platform may still require ChatGPT sign-in; the downloadable judge package provides the verified no-account path. Google Developer API terms restrict services directed toward or likely accessed by people under 18; the interface identifies the assistant as 18+. A label alone is not an age-verification control. Resolve the audience/terms requirement before a public launch, or choose an appropriate provider arrangement. Public sharing is enabled at the owner’s request; this is not confirmation of broad resident-launch readiness.

Privacy terms: https://ai.google.dev/gemini-api/terms
Paid-service prompts/responses are not used for product improvement under those terms; security/abuse retention may still apply. Unpaid services have different data-use terms. Do not claim zero retention.


## Bilingual implementation follow-up

The current UI accepts English and Spanish, renders approved fixed text in the selected language, and offers deterministic guided help when the model is unavailable. Both the current question and previous context are screened for recognized sensitive patterns; this is not a comprehensive personal-data detector. Recognized emergencies and sensitive input use fixed safety messages.

After configuring the ignored local `.dev.vars`, run `node --env-file=.dev.vars scripts/evaluate-gemini.mjs` with synthetic prompts only. The evaluator now uses the 30-case benchmark; preserve raw outcomes and independently review relevance. A passing deterministic fallback score does not verify Gemini. Current model-access, quota, billing and terms must be checked for your Google project before deployment.


## Provider-schema compatibility

Gemini 2.5 rejected a response schema containing all 89 long service IDs as an enum: its constrained decoder reported too many states. The provider schema now constrains shape, statuses and list length. The server still validates every selected ID against the approved directory and rejects invented IDs, URLs, extra fields and invalid combinations before rendering.
