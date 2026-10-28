# Spanish language and usability review — October 28, 2026

This is a specialist **AI linguistic/source review**, not approval by a human Spanish speaker, translator, Mableton resident or accessibility tester. Human reviewers in this review: **0**. No comprehension scores, participant task times or native-speaker credentials are claimed. Recommendations below were made from the paired English/Spanish source; the parent implementer owns application changes and final browser verification.

## Scope actually reviewed

- All **5** guided journeys, **8** question steps, **25** choice labels and **22** outcomes in `public/guidance.json`, comparing both languages.
- All **100** interface keys and **16** category mappings in `public/i18n.mjs` (one category alias; the app has 15 categories).
- The **15 distinct service records** reachable from the guided outcomes: Spanish title/description/applicability plus bilingual operator, authority, next-step and preparation fields. This is **15 of 89** service records, not a full-directory translation approval.
- All **6** telephone labels; assistant response construction and Spanish fixed replies; source markup, language switching, saved-plan and print rendering in `public/app.js`.

The 15 records were `find-an-approved-trash-hauler`, `dispose-of-furniture-and-bulky-items`, `waste-disposal-facilities`, `report-a-road-or-neighborhood-problem`, `report-a-code-violation`, `check-city-limits-and-council-district`, `contact-city-departments`, `find-food-housing-and-other-help`, `help-with-energy-bills`, `find-rental-housing`, `cobblinc-transit-services`, `live-bus-tracking`, `cobblinc-go-on-demand-rides`, `paratransit`, and `south-cobb-regional-library`.

## Findings to fix before the demonstration

These are observed wording defects or clarity risks, not measured resident confusion. Preserve canonical IDs, official URLs, contact details and factual restrictions.

| Priority | Exact location | Before | Recommended Spanish replacement | Reason |
|---|---|---|---|---|
| 1 | `i18n.mjs: strings.questionPrivacy[1]`, first sentence | Para mayores de 18 años. | **Para personas de 18 años o más.** | Matches “18 and older”; the original excludes people aged exactly 18. Keep the rest of the disclosure. |
| 1 | `guidance.json: journeys[id=trash].description.es` | Recolección pendiente, nueva empresa u objetos grandes. | **No recogieron la basura, necesita una empresa o quiere desechar un objeto grande.** | “Pendiente” can mean a future collection. Describes the resident's actual problem. |
| 1 | `trash.steps.need.choices[0].label.es` | No recogieron mi basura habitual | **No recogieron mi basura el día previsto** | Makes the missed scheduled pickup explicit; “basura habitual” modifies the waste, not the collection. |
| 1 | `trash.steps.provider.choices[1].label.es` | Mi asociación o administrador lo organiza | **Mi asociación de propietarios (HOA) o el administrador de la propiedad organiza el servicio** | Expands HOA in context and identifies the administrator. |
| 1 | `trash.outcomes.unknown.title.es` | Identifique primero a su empresa | **Identifique primero la empresa que recoge su basura** | Prevents a generic “your company” instruction. |
| 1 | `trash.outcomes.unknown.instruction.es` | Revise su factura o contenedor, o pregunte al administrador. La lista aprobada no identifica la empresa de cada dirección. | **Revise el nombre de la empresa en su factura o en la etiqueta del contenedor, o pregunte al administrador de la propiedad. La lista de empresas aprobadas no permite buscar qué empresa atiende cada dirección.** | Restores the label clue and explains the directory limitation in concrete terms. Does not imply an address lookup exists. |
| 1 | `trash.outcomes.missed.instruction.es` | Reporte la recolección pendiente a la empresa de su factura. La ciudad no opera la ruta. | **Avise que no recogieron la basura a la empresa que aparece en su factura. La ciudad no presta el servicio de recolección.** | Avoids “pending” and the abstract “operates the route”; preserves private-provider responsibility. |
| 1 | `dumping.steps.location.choices[1].label.es` | En una propiedad dentro de Mableton | **En una propiedad dentro de los límites municipales de Mableton** | Preserves the city-limits distinction, which matters when a postal address says Mableton. |
| 1 | `dumping.outcomes.boundary.instruction.es` | Una dirección postal de Mableton no prueba la jurisdicción. Use el mapa oficial o pregunte a la ciudad. | **Que su dirección postal diga Mableton no confirma que esté dentro de los límites municipales. Use el mapa oficial o consulte a la ciudad.** | Explains “jurisdiction” without requiring legal vocabulary. |
| 1 | `transport.outcomes.paratransit.instruction.es` | El paratránsito requiere certificación y puntos de viaje elegibles. Tener una discapacidad no confirma por sí solo la elegibilidad. | **Para usar el transporte adaptado (paratránsito), necesita la certificación de CobbLinc. El origen y el destino también deben cumplir los requisitos de la zona de servicio. Tener una discapacidad no significa que cumpla automáticamente todos los requisitos.** | “Puntos de viaje elegibles” is a literal, opaque phrase. Retains certification and both-endpoint requirements without promising service. |
| 1 | `guidance.services` for `cobblinc-transit-services`, `cobblinc-go-on-demand-rides`, and `paratransit`: `next.es` | Confirme con CobbLinc el origen, destino, día del viaje y necesidades de accesibilidad. Go depende de zonas; el paratránsito requiere certificación y puntos de viaje elegibles. | **Confirme con CobbLinc el origen, el destino, el día del viaje y sus necesidades de accesibilidad. CobbLinc Go solo atiende ciertas zonas. Para usar el transporte adaptado (paratránsito), necesita certificación y debe confirmar que tanto el origen como el destino cumplan los requisitos de la zona de servicio.** | Keeps the printable service card consistent with the journey's plain-language explanation. |

## Useful secondary improvements

These are lower priority than the factual/decision-boundary items above; their priority is not a demand to expand scope before the deadline.

| Location | Recommended replacement or action | Reason |
|---|---|---|
| `trash.outcomes.hoa.title.es` | **Consulte a su asociación de propietarios o al administrador de la propiedad** | Expands the same terms in the result heading. |
| `trash.outcomes.hoa.instruction.es` | **Pregunte qué empresa recoge la basura de su propiedad y cómo avisarle cuando no la recojan el día previsto.** | Concrete reporting action instead of “reportes de recolecciones pendientes.” |
| `trash.steps.provider.choices[2].label.es` | **No sé quién recoge mi basura** | Avoids gendered “seguro” and makes the uncertainty specific. |
| `dumping.steps.location.choices[0].label.es` | **En una calle, carretera o espacio público junto a la vía** | More understandable than the repetitive “espacio público de la vía”; still does not decide the receiving agency. |
| `dumping.outcomes.property.title.es` | **Contacte al departamento de normas municipales (Code Enforcement)** | Retains the official English department name residents may encounter when calling or opening the site. |
| `housing.outcomes.assistance.instruction.es` | **Confirme la disponibilidad con las organizaciones. MabletonLink no puede determinar si cumple los requisitos ni reservar fondos.** | Replaces “elegibilidad” with an explicit meaning. |
| `housing.outcomes.condition.title.es` | **Confirme qué entidad atiende la propiedad y reporte el problema** | Makes the jurisdiction check understandable. |
| `transport.steps.need.choices[2].label.es` | **Transporte adaptado (paratránsito) o accesibilidad para personas con discapacidad** | Explains the unfamiliar service term before using it. |
| `access.description.es` | **Computadoras, impresión, ayuda por teléfono o en otro idioma.** | Natural phrasing instead of “ayuda ... de idioma.” |
| `access.outcomes.language.title.es` | **Pregunte a la entidad si ofrece ayuda en su idioma** | Names the resident need directly. |
| `access.outcomes.language.instruction.es` | **Puede decir: «Prefiero hablar en español. ¿Hay un intérprete o un formulario traducido disponible?» La disponibilidad varía. Los sitios externos pueden estar solo en inglés.** | More natural request while keeping language access explicitly unguaranteed. |
| `strings.noPhone[1]` | **No hemos verificado un número directo para este servicio. Consulte la página oficial de contacto o el enlace «Ayuda para usar servicios en línea» que aparece abajo.** | Names the actual fallback control; “ayuda de acceso” is abstract and could mean account access. |
| `strings.official[1]` | **Abrir sitio oficial** | Describes an external website action more clearly than “Abrir servicio oficial.” Keep the new-tab announcement. |
| Source dates in `app.js: actionCard` | Format display through `Intl.DateTimeFormat` for the active locale; retain ISO in `datetime` and stored source data. | Visible ISO dates are machine-oriented. Avoid interpreting a UTC date as the previous day in local time. This is a presentation improvement, not an error in the verified date. |

## Core demonstration trace

The source graph is coherent and resolves the unknown-provider case conservatively:

1. `#guide?journey=trash` → **No recogieron mi basura el día previsto**.
2. `step=provider` → **No sé quién recoge mi basura**.
3. `result=unknown` → identify the actual company from the bill/container label/property manager; the result points only to `find-an-approved-trash-hauler`.
4. The service card distinguishes the private contracted/HOA provider from the city approval role. It does **not** claim that the city collects trash or that the list can search by address.
5. **Guardar este plan** stores only the plan's kind/ID/outcome locally. It does not store a resident question or submit a report. **Imprimir o guardar como PDF** renders the same current Spanish guidance, official sources and no-submission warning.
6. Language switching rerenders the route and service metadata; the saved plan resolves translated text from the same stable IDs. The graph and printing code do not require a Gemini response.

This trace is source-inspected. The parent must verify the complete UI path, updated Spanish text, overflow, focus and printed result in a browser; this report does not claim that inspection happened here.

## Wording and safeguards worth retaining

- **“No se ha enviado ninguna solicitud.”** is unambiguous and appears after finding instructions and after saving a plan.
- **“Este plan es una guía, no un recibo ni prueba de una solicitud enviada.”** correctly distinguishes a printable plan from official receipt.
- The form disclosure identifies Google Gemini and excludes private details; do not remove it to shorten the interface.
- Library guidance requires confirmation of hours, fees and available staff help; it does not promise free printing.
- Housing search and financial assistance remain separate; no eligibility or funding promises are made.
- Emergency wording consistently uses formal imperatives and says the app cannot send help.
- Proper agency/product names such as CobbLinc, LIHEAP and SeeClickFix should remain recognizable. Translate their purpose around the name rather than replacing the official brand.
- `document.documentElement.lang` follows the chosen language. The translation-draft disclosure should remain until an actual independent human review is completed.

## Response-template engineering observations

`server/assistant.mjs` uses fixed Spanish messages from `i18n.mjs`; `app.js:responseMarkup` renders its own localized fixed text and local translated service titles. The visible interface therefore does not depend on translating arbitrary Gemini prose. The server's returned service metadata remains English, but the current browser uses canonical IDs to retrieve Spanish text locally.

The API distinguishes `service_type`, `provider` and `city_limits` internally, but Spanish responses collapse these to the generic `clarify` prompt; the browser also collapses clarification variants in both languages. This loses useful context for ambiguous location/provider questions. A follow-up enhancement should preserve a validated clarification ID and map it to complete English/Spanish strings. Do not display unchecked model prose to solve this.

## Remaining human questions

Ask a proficient Spanish-speaking reviewer to paraphrase, without prompts: who collects the trash; what the city does; how to identify the current company; whether opening/saving/printing sent a request; what paratransit certification and service-area restrictions mean; and what to do when an external page is English-only. Test whether “empresa de recolección,” “asociación de propietarios,” “límites municipales” and “transporte adaptado” fit local resident usage. Observe rather than assume comprehension. This AI review supplies candidate corrections; it does not close that human validation task.

## Applied-change verification — second source review, October 28, 2026

The parent integrated the wording changes, and this reviewer inspected the current application diff read-only. The original inventory above is the first-pass snapshot, not a claim that later additions existed then. The interface now has three additional complete bilingual clarification messages (**103 keys** total at this review).

Verified in current source:

- The age disclosure includes people aged 18; unknown/missed trash and HOA wording is concrete; the container-label clue and no-address-lookup limitation remain intact.
- The municipal-boundary choice, postal-address warning and official `Code Enforcement` name preserve the same routing boundaries in both languages.
- The paratransit journey now explains certification, qualifying origin/destination and the lack of automatic eligibility in matched English/Spanish wording.
- Bus, CobbLinc Go and paratransit cards now have different next-step instructions. Their Spanish preserves checks for route/stops/timetable, limited coverage, fare/accessibility or certification as appropriate; none promises an available trip.
- The city map and contact cards now explain what to check, where to ask, and that the resident should provide a location directly to the city rather than the AI assistant. The paired instructions are semantically consistent.
- `clarify_service_type`, `clarify_provider` and `clarify_city_limits` are complete localized messages. The server retains the validated clarification ID, and the client allowlists the same three IDs before choosing fixed text. This addresses the clarification-specificity loss identified in the initial report without exposing model-written prose.
- Existing explicit no-submission and translation-draft disclosures remain present.

Two small follow-up corrections were sent to the parent during this verification:

1. In `clarify_provider[1]`, replace ambiguous **“Comparta solo su nombre”** with **“Comparta solo el nombre de esa empresa o entidad, no el número de cuenta.”** “Su nombre” could be misread as requesting the resident's own name.
2. The regular-bus card's preparation text still inherited **“before booking / antes de reservar.”** Replace it with: EN **“Have your general starting area, destination and travel time ready. Ask whether the route serves both places.”** ES **“Tenga a mano la zona de origen, el destino y la hora del viaje. Pregunte si la ruta permite viajar entre esos lugares.”** This avoids implying a fixed-route bus reservation requirement.

This remains source verification by an AI specialist, not a human language sign-off or evidence of Spanish screen-reader pronunciation, printed layout or resident understanding. Parent-led browser/build/regression evidence is recorded separately.
