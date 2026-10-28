# MabletonLink — product brief

## Page 1: Resident experience

MabletonLink helps residents identify the right service provider and understand their next step. It combines a directory of 89 approved official service links with five guided journeys, English/Spanish navigation, favorites and printable plans. The interface uses black and white, clear labels, large controls and no application account or SSO.

The five journeys cover missed trash collection; dumped waste and property concerns; housing and bill assistance; transportation access; and help using online services. Each asks a small number of concrete questions and produces instructions grounded in the approved directory.

An action card explains who provides the service, who is responsible, when the service applies, what to do next, what to prepare and how to obtain help. Verified phone alternatives appear where available. Unverified numbers are not invented. Official sources and review dates remain available on the card and in printed plans.

Provider distinctions are central: private haulers collect trash; rental searches differ from rental assistance; road responsibility varies; CobbLinc Go requires coverage checks; and paratransit has certification and geographic requirements. Library access helps residents who need a computer, Wi-Fi, printing or scanning. External agency websites may still be English-only.

The app records only honest local states: instructions found, official link selected and plan saved on this device. It cannot submit a city request, issue a ticket, make a payment, determine eligibility or confirm an external submission. Saved plans contain service/outcome identifiers, not resident questions or account information.

**Intended users:** residents who find fragmented government websites difficult, including older adults, people with limited digital access and residents who prefer Spanish. Language is an explicit choice. No demographic inference or location tracking is used.

---

## Page 2: Implementation, evidence and next decisions

The static directory, translations and guided journeys work without an AI response. The optional server-side Gemini integration selects approved service IDs through a constrained JSON schema. The server builds fixed responses from approved records, enforces same-origin requests and quotas, rejects malformed output, and handles recognized urgent/sensitive input before sending it upstream. Secrets never belong in browser code. These controls limit exposure but do not guarantee perfect model relevance or detect all personal information.

The current deployment has no Gemini key. The visible fallback is preset directory guidance. Google currently limits Gemini 2.5 access to previous active users; model selection remains configurable. Account-specific access, cost and quota must be verified. There is no claim that this deployment qualifies for a competition's free-tier/no-card rules.

**Completed software evidence:** bilingual data validation, guided-path coverage, a 30-case synthetic routing regression, backend security tests and production build/API checks. Browser evidence and final gate status accompany the implementation. A developer-authored synthetic test is not an independent resident study or a live-model accuracy result.

**Pending external validation:** 5–8 adult resident sessions, independent Spanish review, native spoken screen-reader validation, real-key Gemini evaluation, and review of the actual participant guide. The Site remains owner-private; broad access requires a deliberate publishing decision.

**Proposed adoption:** choose a named directory steward; validate ownership with city/county contacts; pilot with a library/community group; fix observed barriers; then consider broader distribution. High-use sources and contact numbers need regular review, with immediate checks after agency changes. Data-only maintenance supports phone/text/source updates without changing application code.

**Scope held back:** maps and district dashboards, resident accounts, intake forms, photo uploads, ticket status and case management. Those features require separate ownership and integrations. Success here is a resident reaching the right provider with an understandable next step.

Supporting files: SOURCES.md, MAINTENANCE.md, DEMO-SCRIPT.md, EVALUATION-KIT.md, QA-IMPLEMENTATION.md and the root GATES.md.
