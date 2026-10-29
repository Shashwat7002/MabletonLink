# Resident feedback update — October 29, 2026

## Changes

- Separate **Ask AI** navigation and **Help** instructions. Both use named native dialogs; Help explains search, categories, favorites, AI and contacting providers.
- Name the assistant **Ask MabletonLink AI**, place the question above its answer, and label the clear-conversation action **Reset** with an explanation.
- Use a labeled category dropdown on Home with an explicit **View services** button. All services keeps the same category choices.
- Render the saved checkmark with a stroke and no fill, fixing the wedge shown in the feedback screenshot.
- Replace **Save this plan** with **Save favorite**. Services and tailored next steps appear together in Favorites. Guided results retain their specific outcome; printing remains separate and available even after removing a favorite.
- Provide the changes in English and Spanish, with a two-column mobile navigation layout and wrapped assistant heading.

## Existing saved data

`public/saved-items.mjs` reads the previous favorites and plans keys if no valid v2 list exists. The same service saved in both old lists appears once; different guided outcomes remain distinct. The first change writes one authoritative v2 list. An empty v2 list prevents removed legacy items from returning after reload. Previous keys remain untouched as a backup. Existing saved-plan URL keys still resolve for retained items.

Data remains in the current browser and origin. This does not transfer saved data between the former chatgpt.site hostname and vercel.app, or between browsers.

## Verification

- `npm test`: 45 tests pass, including five migration, removal, malformed-storage and storage-unavailable cases.
- Directory verifier: 89 services, five journeys, 22 terminal paths, 117 paired UI strings; negative controls pass.
- JavaScript syntax, Vercel asset build and standalone export pass. The exported HTML loads, opens Help and retains a saved water service after refresh in a separate local browser origin; no JavaScript errors were observed.
- Browser checks: Help opens with heading focus; Escape returns to Help; Help → Ask AI opens one dialog with input focus. Empty questions receive an error. English water-bill and Spanish missed-pickup fallback responses appear below the question; Reset clears input, answer and prior context and returns to the input.
- The Home dropdown opens the correct category with Enter on View services. Utilities shows 10 services in both languages.
- Save state is shared by service cards and details. A saved guided result retains the unknown-provider explanation when reopened. Removing it from its direct result view leaves the instructions and print action available.
- Synthetic legacy data on localhost: duplicate water service plus one trash outcome becomes two favorites. The old plan URL opens the right instructions. Remove both, reload: zero favorites, empty v2 list, old keys unchanged.
- English desktop at 1280 × 900 and Spanish mobile at 320 × 800: no horizontal overflow in checked Home, category results and dialogs. Assistant input and answer focus stay below the sticky dialog header.
- Spanish print action generates provider information, phone, sources, review dates and explicit no-submission text. Print media was inspected. The system print call was intercepted on the disposable local test page; no physical print job was sent.

Screenshots are stored locally under `artifacts/feedback/` (not committed). These checks do not constitute a fresh native VoiceOver run, a human usability study or WCAG certification. Local UI tests intentionally exercised the labeled directory fallback; production AI connectivity is verified separately after deployment.
