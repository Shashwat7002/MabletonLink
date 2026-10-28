# Gemini activation — 2026-10-28

The supplied key is configured as the hosted `GEMINI_API_KEY` secret. It is not stored in a local environment file, application source, frontend bundle or this report. The Site remains owner-private, with `gemini-2.5-flash` and a 200-attempt application daily cap. Billing and Google quota settings were not changed.

## Compatibility fix

A direct request proved that this project can access Gemini 2.5 Flash. The original full request failed because its JSON response schema enumerated 89 long service IDs. Google returned `INVALID_ARGUMENT`: too many constraint states. The provider schema now specifies the object shape, permitted statuses, clarification types and at most three string IDs. The server remains the authoritative allowlist: unknown IDs, injected URLs, extra properties, duplicate IDs and invalid combinations are rejected before anything is displayed. A regression test covers the simplified schema and retained validation.

## Quota behavior

The initial unpaced benchmark reached the project's free-tier limit: Google returned `429 RESOURCE_EXHAUSTED` and explicitly reported five generate-content requests per minute. These unavailable responses are not routing successes; the first run is retained in `tests/evidence/live-gemini-initial-quota-results.json`.

The paced run then reached a separate daily quota. A direct diagnostic returned `429 RESOURCE_EXHAUSTED`, explicitly reporting **20 generate-content requests per day on Free Tier**. This limit is insufficient for the full 27-provider-call benchmark in one day. Google's daily quota resets at midnight Pacific (3 a.m. Eastern on October 29, 2026); the diagnostic reported approximately 9 hours 39 minutes until retry. This is the observed project allowance, not a universal Gemini plan limit.

The evaluator now spaces calls 13.5 seconds apart, checkpoints each result and stops on unavailable responses. Google quotas apply per project, so other uses of the same project can still consume capacity. The application offers its preset directory fallback when inference is unavailable; it does not retry indefinitely or silently change models. The app's daily counter does not replace Google's token, minute or daily quotas. See [Google rate-limit documentation](https://ai.google.dev/gemini-api/docs/rate-limits).

## Evaluation status

The paced live benchmark stopped after **10 of 30 cases: nine passed, one unavailable, 20 unrun**. It is incomplete and does not pass the full evaluation gate. All nine completed model decisions selected the expected approved service. The original paced output is preserved in `tests/evidence/live-gemini-paced-quota-results.json`; resumable evidence is in `tests/evidence/live-gemini-results.json`. It contains synthetic questions only. Three emergency/sensitive cases in the full suite are handled locally before calling Google; they must not be described as model inferences. The full runtime security suite contains 31 passing tests.

After quota recovery, supply the key privately through the environment or ignored `.dev.vars`, then run:

```sh
node --env-file=.dev.vars scripts/evaluate-gemini.mjs --resume
```

Resume retains the nine completed responses, including any routing failures rather than selectively discarding them. It retries only unavailable or unrun cases, preserves unavailable-attempt history, and rejects a changed model or changed service directory, benchmark, policy or assistant source. Twenty-one cases remain, requiring up to 18 provider calls. `node scripts/evaluate-gemini.mjs --check-resume` validates the saved checkpoint without a key or API call. No local key file was created during this activation.

This evaluation does not establish perfect relevance or human usability. Independent Spanish review, resident sessions, spoken screen-reader validation and competition eligibility remain pending. Because the key was shared in chat, rotate it before a public launch and replace the hosted secret through the Site's environment settings.
