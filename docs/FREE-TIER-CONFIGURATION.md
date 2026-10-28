# Free-tier configuration — 2026-10-28

The owner chose Gemini 3.1 Flash-Lite after review of the actual Georgia 311 participant guide and their Google AI Studio dashboard. Free means no API charge within the free tier; it does not mean unlimited calls. No billing account was linked, no paid tier was enabled and no payment was made.

## Verified allowance

The API Keys page showed the supplied Mableton key under the same project as the Rate Limit page, labeled **Free tier**. The authenticated dashboard showed these limits (not remaining requests):

| Model | Requests/minute | Input tokens/minute | Requests/day |
| --- | ---: | ---: | ---: |
| Gemini 2.5 Flash | 5 | 250,000 | 20 |
| Gemini 2.5 Flash-Lite | 10 | 250,000 | 20 |
| Gemini 3.1 Flash-Lite | 15 | 250,000 | 500 |

Observed allowances are project-specific and can change. Keys and other applications in the same Google project share limits. Daily Google quota resets at midnight Pacific; the site's local daily cap resets at midnight UTC. Neither counter promises 500 successful answers or controls other project consumers. Local directory search, categories and guided journeys do not consume Gemini quota.

## Runtime settings

The selected model is `gemini-3.1-flash-lite`; the private key stays in the hosted secret store. Hosted environment revision 2 sets `ASSISTANT_DAILY_LIMIT` to 500 requests per UTC day, with existing per-session and per-network safeguards retained. `ASSISTANT_ENABLED` stays true. Deployment status is recorded in GATES.md; changing an environment value alone does not activate it. The site's owner-private audience is preserved.

For 3.1 Flash-Lite, requests use Google's recommended temperature 1 and minimal thinking, one candidate and a 1024-token output ceiling. Output is still validated against the same approved service IDs and fixed response templates. No model-generated prose or URL is rendered. An explicit 2.5 rollback retains its compatible zero thinking budget. No automatic model or account rotation is used.

## Guide findings

Source: the user-supplied 20-page `[Participant Guide] Georgia 311 Challenge 2026 -1.pdf`.

- Page 13 lists Gemini 2.5 Flash and Flash-Lite without billing, and permits other free tools if clearly disclosed. It contains no unlimited-API promise or special challenge credit instructions.
- Page 17 requires public data only, operation within free tiers, no payment to reproduce/review, human review for outbound actions, accessibility and source citations.
- Page 19 requires at least one Google technology. This prototype uses Gemini.
- Page 9 accepts a deployed link or runnable repository with setup instructions. It does not require a public site.

Gemini 3.1 Flash-Lite is disclosed as a newer free-tier Google model. We interpret page 13 as permitting it; organizer acceptance is not independently confirmed. Judge access, no-card hosting reproduction and human usability reviews still require follow-through. No outgoing email was sent.

## Verification

The 32-test backend suite and production build checks pass, including the new model configuration, retained 2.5 rollback and existing safety boundaries. The unchanged 30-case live benchmark completed: **29 passed, one failed**, meeting its 27/30 threshold with all six hard safety assertions passing. Of those passing cases, 26 used real model responses and three used local emergency/sensitive-input checks.

The failed case A7 was an ambiguous court notice. Google returned HTTP 200, but the response did not pass server validation; the resident received the unavailable/fallback path rather than unverified content. A separate diagnostic returned a valid clarification, but it does not replace that failed benchmark case. This is a measured model reliability limitation, not a perfect-accuracy claim.

Two earlier `provider_unavailable` attempts were explicitly resumed and remain in the history; the benchmark made 29 provider attempts for 27 model cases. The precise cause of those two early unavailable responses was not captured, so they are not labeled quota errors. Later instrumentation records upstream HTTP status and elapsed time without credentials or prompts. Rejected model outputs are retained as failures instead of being retried until a passing answer appears.

Historical 2.5 outcomes remain in `tests/evidence/live-gemini-2.5-results.json`; current results are in `tests/evidence/live-gemini-results.json`. The final source fingerprint matches the evaluated directory, cases, policy and server implementation. The authenticated quota review is recorded in `tests/evidence/gemini-free-tier-review.json`.

The supplied key was used through hidden process input for synthetic tests only; no local environment file was created. Rotate the shared key before a public launch. No claim of complete personal-data detection or real-world model accuracy is made.

## Primary references

- [Google's model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Rate limits and reset behavior](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Thinking configuration](https://ai.google.dev/gemini-api/docs/generate-content/thinking)
- [Gemini 3 temperature recommendation](https://ai.google.dev/gemini-api/docs/generate-content/gemini-3)
