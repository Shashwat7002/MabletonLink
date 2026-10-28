# Source and uncertainty ledger

Reviewed 2026-10-28. `public/services.json` retains each of the 89 approved records' own official URL, provenance URL, review date and verification note. A review date is not a promise of live availability. Account workflows, actual submissions, charges and eligibility have not been exercised.

| Source | What the implementation uses | Limit / follow-up |
|---|---|---|
| [Mableton Solid Waste](https://www.mableton.gov/1333/Solid-Waste) | Private haulers provide collection; city approves providers. Existing bill/HOA identifies the resident's provider. | Approved list does not map every address to a provider; schedules and fees belong to the hauler. |
| [Bulky Item Disposal](https://www.mableton.gov/1521/Bulky-Item-Disposal) | Ask current hauler about acceptance, arrangements and charges; disposal/donation alternatives. | No promise of free or included pickup. |
| [Code Enforcement](https://www.mableton.gov/1201/Code-Enforcement-Department) | City property concerns, complaint route and 404-590-2511. | Department determines whether a violation exists. City boundary matters. |
| [Resident Resource Guide](https://www.mableton.gov/1212/Resident-Resource-Guide) | Official provenance for Cobb / SeeClickFix road reporting. | Responsibility varies by road and problem. No submission made. |
| [City district map](https://www.mableton.gov/1247/Find-My-District) | Optional external boundary/district check. | Postal address does not prove jurisdiction. No geolocation or address collection in MabletonLink. |
| [CobbLinc](https://www.cobbcounty.gov/transportation/cobb-transit-service-cobblinc) | Customer service 770-427-4444; certification 770-429-7855. | General customer service is not represented as a verified Go booking number. |
| [CobbLinc Go](https://www.cobbcounty.gov/transportation/cobb-transit-service-cobblinc/routes-schedules/cobblinc-go) | Zone-specific service; ask about current operation and both trip endpoints. | This page and the main transit page list conflicting Go reservation numbers (770-427-4444 vs 770-429-4444) and dated rollout language. Confirm with the operator before changing guidance. No citywide claim. |
| [Paratransit](https://www.cobbcounty.gov/transportation/cobb-transit-service-cobblinc/paratransit) | Certification and geographic eligibility apply. | No disability-based eligibility decision, live reservation or guaranteed trip. |
| [South Cobb Regional Library](https://www.cobbcounty.gov/library/library-locations/south-cobb-regional-library) | 805 Clay Road, Mableton GA 30126; 678-398-5828; computers, Wi-Fi, printing/scanning. | Confirm hours, fees, identification requirements and available staff assistance. No promise of free printing or interpreters. |
| [Water bill payment](https://www.cobbcounty.gov/water/customers/water-bill-pay) | Quickpay without portal registration; customer service 770-419-6200; bill/account number needed on the official provider site. | No payments or account details collected by MabletonLink. |
| [Cobb County](https://www.cobbcounty.gov/) | County-linked FindHelp directory; 770-528-1000 for general information. | FindHelp access previously returned automated 403. Each organization owns eligibility and availability; general county staff do not allocate assistance funds. |
| [Georgia rental search](https://georgia.gov/find-available-rental-housing) | State-linked rental listings. | Search is not an application for aid or a guarantee of availability. |
| [Georgia DFCS LIHEAP](https://dfcs.georgia.gov/services/low-income-home-energy-assistance-program-liheap) | Program administered through Community Action Agencies; use official provider information. | Local agency, application window, funds and documentation must be confirmed. |

## Research supplied in the brief

The brief cites ACS 2020–2024 data for Census place `16000US1348288`. Its language and household estimates informed the priority of language and access help. They are not 2026 headcounts, district-level estimates or individual user characteristics. No demographic profiling is implemented. The product and demo avoid repeating unverified local statistics.

The competitive review informs the emphasis on provider routing, access alternatives and next steps. Private or incomplete competitor code, names and unsupported product comparisons are excluded from the resident interface and public-facing brief.

## Google and competition verification

[Gemini key documentation](https://ai.google.dev/gemini-api/docs/api-key), [3.1 Flash-Lite model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite), [pricing](https://ai.google.dev/gemini-api/docs/pricing) and [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) checked 2026-10-28. The owner selected Gemini 3.1 Flash-Lite after the matching Google project's dashboard confirmed Free tier, 15 requests/minute and 500/day. See FREE-TIER-CONFIGURATION.md for evidence and live evaluation. This does not remove provider limits or establish free unlimited use.

The original participant-guide link returned a ChatGPT sign-in page. The user later supplied the actual 20-page PDF, `[Participant Guide] Georgia 311 Challenge 2026 -1.pdf`, reviewed on 2026-10-28. Page 13 lists 2.5 Flash/Flash-Lite with billing disabled and also permits other free tools when clearly disclosed. Page 17 requires public data, free-tier operation, no payment to reproduce/review, human review for outbound action, accessibility and sources. Page 19 requires at least one Google technology. The guide provides no special unlimited allowance or challenge credit redemption instructions. Page 9 accepts a deployed link or a runnable repo with clear setup instructions; it does not require a public URL.

Use of the newer free-tier Google model is disclosed. Treat this as our reading of the guide, not organizer approval. Human usability validation, final competition acceptance, judge access and free reproduction of hosting remain unverified. No billing was enabled and no audience was expanded. Contact supplied by the guide: na-developer-communities@google.com; no message was sent.
