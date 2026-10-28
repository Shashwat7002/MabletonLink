# Maintain the approved directory

Proposed owner: a named city or community service-directory steward, with a second reviewer for changes that affect routing, safety or language. This is a proposal, not an agreement with Mableton or Cobb County.

Routine review: monthly for high-use service routes and phones; immediately after an agency transition, changed URL or reported error. Recheck seasonal programs before the relevant season. The approved-hauler source says its list is updated quarterly; link to the authoritative list rather than copying a list that becomes stale.

## Data-only update example

To change the South Cobb library phone after checking its official location page:

1. In `public/guidance.json`, update `phones.library.number`, `source` and `reviewed_on`. Preserve both language labels. Never put an unverified number in the field.
2. If the service changed, update the English record in `public/services.json`, the same ID in `public/services.es.json`, and both languages of `guidance.services["south-cobb-regional-library"]`.
3. Record what changed and the official source in this ledger or the change description. A successful HTTP response alone is not factual verification.
4. Run `node scripts/verify-directory.mjs` and `node scripts/verify-routing.mjs`; review the access journey in both languages. Any change to a journey must be checked through each branch.
5. Rebuild, inspect the action card and printed plan, then publish the source through the existing Sites workflow. Retain the old source commit for rollback.

No application-code change is needed for that phone update. Operator, authority, next step, preparation and contact IDs are data fields. Both locales are required by the validator; unknown service IDs, missing translations and unreachable journey outcomes fail validation.

## Correcting or removing a service

Preserve stable service IDs when possible so favorites and saved plans continue to work. Plans store IDs and outcome choices, not stale copies of contact details; opening a plan renders the current reviewed guidance. If an ID or outcome is removed, saved references are filtered out on load. Explain substantive changes to users in release notes. Never repurpose an old ID for a different service.

When a source is uncertain, retain the uncertainty in `verification_note`, route to an official contact, and avoid a definitive eligibility, coverage, deadline or fee statement. Resolve the CobbLinc Go phone discrepancy with the operator before replacing the general customer-service alternative.

## Adoption proposal

Start with a small supervised pilot through a library or community group. Ask a city/county contact to validate ownership distinctions and escalation routes. Have an independent Spanish reviewer check each journey and core record. Recruit 5–8 consenting adults using the evaluation kit. Fix blocking issues and rerun the benchmark before wider promotion. A public demo requires an explicit audience decision and the participant guide's requirements.

Hosting, model quota, stewardship time and translation costs need an owner. The current Site is owner-private. There is no ticketing integration, case management, account system, personal-data intake or guarantee of official endorsement.
