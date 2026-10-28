# MabletonLink simulated usability review

Reviewed October 28, 2026 by an AI UX Researcher subagent. This is an expert cognitive walkthrough with five hypothetical perspectives, **not five participant sessions**. Human participants: **0**; Mableton residents recruited: **0**; nonresident human testers: **0**. No participant quotes, comprehension scores, satisfaction ratings or human completion times were collected.

## Questions and method

Can a resident identify the responsible service without mistaking city approval for city operation? Does the flow handle an unknown provider, uncertain jurisdiction or unknown availability without guessing? Are Spanish content, keyboard progression and non-submission notices available at the decision point?

I exercised the existing published Site in my own browser tab using synthetic scenarios and inspected its accessibility tree after each transition. I used the five perspectives below as evaluation lenses, not empirical personas or claims about how all older adults or Spanish speakers behave. I reviewed `public/app.js`, `public/guidance.json`, `public/i18n.mjs` and the canonical service records. The reviewed release was source `13da41c15e256d0d178e5b387d2c673e7597fb0a`; the parent may subsequently fix the findings.

Activation counts below are manually counted choice/link activations from the Home page to the first useful result. They exclude reading, scrolling, initial language selection and resetting between scenarios. They are **not** interaction-cost estimates for people. Only scenario 3 includes actual Tab/Return interaction. No official form, payment, phone call or request was submitted. No live Gemini prompt was sent by this reviewer.

## Five simulated walkthroughs

| ID and hypothetical perspective | Task and exact observed path | Browser evidence and result | Activations |
| --- | --- | --- | ---: |
| S1: older adult, unfamiliar with city/provider division, English | Home → Trash pickup → My regular pickup was missed → I am not sure. Route: `#guide?journey=trash&result=unknown`. | Result asks the resident to identify their existing provider from bill/cart/property manager. Operator is the contracted private hauler or HOA provider; city approves haulers but does not collect. The approved list is explicitly not an address lookup. A specific hauling company remains unknown, appropriately. | 3 |
| S2: Spanish-preferring adult with no home printer | Spanish Home → Ayuda para usar servicios en línea → Imprimir o escanear documentos. Route: `#guide?journey=access&result=print`. | Reached Biblioteca Regional de South Cobb, 805 Clay Road and telephone 678-398-5828. Spanish text says to confirm charges, formats, hours and assistance; it does not promise free printing. Language selection preserved the earlier trash result before returning Home. | 2 |
| S3: adult with motor-access needs using keyboard controls for choices | Home → Get around without a car → Paratransit or disability access. Route: `#guide?journey=transport&result=paratransit`. | Topic link activated by pointer; after route focus landed on the main heading. Three Tabs reached the third choice and Return opened the result. Focus moved to the result heading. CobbLinc and its certification number 770-429-7855 appeared; certification/service-area restrictions were present. This is a limited keyboard check, not full screen-reader validation. | 2 choices, plus 3 Tab presses |
| S4: adult seeking rent assistance under time pressure | Home → Housing or help with bills → Help with rent, food or other essential costs. Route: `#guide?journey=housing&result=assistance`. | The choice screen distinguished help paying expenses from finding a rental. Result led to the county-linked assistance directory and said to contact each organization for openings and eligibility. It does not establish a currently available program, reserve funds or determine eligibility. | 2 |
| S5: resident uncertain whether a dumped-waste location is inside city limits | Home → Dumped waste or a property concern → No — it is a routine concern → I do not know the city boundary. Route: `#guide?journey=dumping&result=boundary`. | The result linked the official city-boundary map and city departments, warned that a Mableton postal address does not establish jurisdiction, and supplied 404-590-2511. It did not select an enforcement agency based on an unverified address. Generic preparation text weakens the next-step instructions; see F3. | 3 |

**Measured scope:** 5/5 scripted paths reached their intended directory/guidance result; all five displayed “Instructions found. Nothing has been submitted.” or its Spanish equivalent and a plan-not-receipt reminder. No observed result contradicted the approved directory's provider distinction. This is not a 100% resident success rate: unknown-provider and boundary paths intentionally stop before identifying a final service provider. Human correct-provider selection, completion without help, time, comprehension of non-submission and improvement over official sites are all **unmeasured**.

Ambiguity was exercised in S1 and S5. Service availability was explicitly unconfirmed in S2/S4. All five guided paths were used without asking Gemini. A forced Gemini outage was not exercised by this subagent; parent integration tests must establish outage behavior separately.

## Comparison with official-site information

This is a current content/navigation comparison, not a controlled usability experiment. Official pages were read with the web tool; their full keyboard interactions, translation quality and real-account forms were not tested. No time saving or superiority percentage can be inferred.

| Equivalent task | Official source observation | MabletonLink observation and trade-off |
| --- | --- | --- |
| Identify responsibility for missed trash collection | The [Mableton Solid Waste page](https://www.mableton.gov/1333/Solid-Waste) explains private collection and provider-managed scheduling, then links approved residential/commercial haulers. It also suggests checking with an HOA. | S1 asks whether the resident knows their company before showing a bill/cart/manager next step. It makes the operator distinction explicit, but still requires an external lookup when the resident does not know the company. |
| Find printing help | The [South Cobb library page](https://www.cobbcounty.gov/library/library-locations/south-cobb-regional-library) contains address/telephone, hours and printing/scanning facilities after other branch content. Its printer link opens [Libraries Take-Home Technology](https://www.cobbcounty.gov/library/library-services/libraries-take-home-technology), with wireless-printing instructions further down. | S2 consolidates the branch, phone, preparation and fee warning in Spanish. It deliberately omits current prices and upload instructions, leaving those to the official source. The official linked page provides greater operational detail. |
| Learn how to use paratransit | The [CobbLinc Paratransit page](https://www.cobbcounty.gov/transportation/cobb-transit-service-cobblinc/paratransit) provides certification/service-area conditions, a Spanish brochure and detailed policies, fares and reservations. | S3 surfaces certification and a contact number quickly but currently mixes another service's coverage wording into the card. The official source remains necessary to verify trip requirements. |
| Check whether city jurisdiction applies | [Find My District](https://www.mableton.gov/1247/Find-My-District) directs visitors to an interactive map to check a home/business and obtain a district when inside city limits. | S5 asks the boundary question before routing an enforcement concern, which avoids an unsupported assumption. Its generic card instructions currently fail to explain how the map resolves the uncertainty. |

## Actionable findings

These are observed interface/content conditions plus **predicted human risks**, not observed participant failures. None establishes that a real user was confused.

### F1 — Announce the new guided question, not the unchanged journey name

**Observed:** At `trash&step=provider` and `dumping&step=location`, focus remained on `#page-title` (“Trash pickup” / “Dumped waste or a property concern”) while the new question appeared in `#question-title`. `public/app.js:93` always focuses `#page-title` after a hash change; `renderJourney` at lines 45–48 puts the actual question in a separate heading. Tab still reached the first choice correctly.

**Risk:** A screen-reader user can hear the same title after making a choice and may not know what changed. Actual spoken VoiceOver/NVDA output was not tested.

**Fix:** For guided question views, move programmatic focus to a focusable `#question-title` after rendering. Keep result views focused on their result heading. Verify the next Tab reaches the first choice; retest the same behavior on language change and back navigation. Priority: medium, high relevance to the requested accessibility goal.

### F2 — Make transport preparation specific to the selected service

**Observed:** `public/guidance.json`, `services.paratransit.next`, includes both “Go coverage is zone-specific” and “paratransit requires certification and eligible endpoints.” The card's preparation text says “both trip endpoints.” The paratransit result also uses “eligible trip endpoints.”

**Risk:** A first-time rider may think Go and paratransit share rules. “Endpoints” is unnecessary jargon for an older or nontechnical resident.

**Fix:** Give Paratransit its own next step: ask CobbLinc how to apply for certification and whether the places where the rider gets on/off are served. Explain that approval and service-area checks are required; do not promise a ride. Keep Go zone instructions on the Go card. Use matching plain Spanish and have the Spanish specialist review it. Priority: medium.

### F3 — Replace generic boundary-check preparation with a concrete map/call task

**Observed:** The boundary outcome is appropriately cautious, but `guidance.services['check-city-limits-and-council-district'].next` and `['contact-city-departments'].next` use the generic “Open the official service page...” paragraph. Both preparation fields ask for a service name and “relevant notice,” even though the immediate task is locating a property.

**Risk:** A person who already answered “I do not know” receives another vague instruction. They may open the map without knowing what result means that city jurisdiction applies, or call without the needed location.

**Fix:** Tell the resident to use the official map to check the property location and, if unclear, ask the city whether that location is inside city limits and which department handles the issue. Tell them to share an address/location only with the official map/agency, not this assistant. Avoid promising a particular map UI feature without checking the embedded map. Priority: medium.

## Preserved strengths and next human study

Keep the explicit city-versus-private-provider distinction, the “not an address-to-provider lookup” warning, large labeled choices, distinct assistance/rental choices, telephone alternatives, preserved language selection and visible non-submission wording. These were directly observed; whether residents notice and understand them requires people.

Use `docs/EVALUATION-KIT.md` for five short **real** sessions. Alternate task order between MabletonLink and the relevant official entry page to reduce learning effects. For each task record the selected provider, whether the next step was found without moderator help, elapsed time and the participant's own explanation of whether anything was submitted. Count a guidance handoff separately from completed agency service. Mark nonresidents as nonresidents, report counts and denominators, and never blend these five AI walkthroughs into the participant sample.

Final self-review: implementation paths and observed counts reread; sources compared against their current text; three findings checked against source and browser evidence; unsupported human metrics removed. No application files changed by this reviewer.
