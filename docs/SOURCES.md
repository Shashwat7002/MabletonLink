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

[Gemini key documentation](https://ai.google.dev/gemini-api/docs/api-key) and [model availability](https://ai.google.dev/gemini-api/docs/deprecations) checked 2026-10-28. Google says new AI Studio keys are authorization keys; 2.5 model access is restricted to previous active users. The app retains the requested configurable 2.5 Flash default. A different permitted model requires real-key evaluation before release.

The participant-guide link in the supplied brief returned a ChatGPT sign-in page, not the guide. The required Google technology, free-tier/no-card qualification, judging rules and public-demo eligibility remain unverified. Do not claim competition compliance or zero cost. No billing was enabled and no audience was expanded.
