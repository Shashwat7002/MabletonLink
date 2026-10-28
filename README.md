# MabletonLink LaunchPad prototype

A buildless, responsive resident service directory with 89 official links in 15 categories. No application sign-in, SSO, database, or third-party JavaScript dependencies.

## Run locally

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. Serve over HTTP; opening index.html directly will not load the JSON directory reliably.

## Implemented

- Home LaunchPad with everyday services and all 15 category tiles.
- Search across all 89 services, with common synonyms and category filters.
- All-services browsing, additional-results loading, and shareable hash URLs.
- Browser-local favorites, saved using `mabletonlink.favorites.v1` in localStorage.
- Service details with applicability, official destinations, source URLs, and review dates.
- Resident assistant preview with contextual directory recommendations and source links.
- On-demand assistant sheet, labeled mobile bottom navigation, keyboard navigation, visible focus, and reduced-motion support.

The assistant is **a deterministic directory demo, not an LLM integration**. It does not submit reports, make payments, determine eligibility, or retrieve personal information. Chat history is held only in page memory. Favorites persist only in this browser; if storage is unavailable they last for the current visit. External agency websites may require their own accounts.

The app identifies itself as an independent resident prototype, not an official City of Mableton website. Hosted preview access is separate from the application's lack of sign-in.

## Files

- `dist/index.html` — accessible application structure.
- `dist/styles.css` — responsive visual design.
- `dist/app.js` — browsing, search, favorites, dialogs, and assistant demo.
- `dist/services.json` — copy of the researched source directory in the parent workspace.
- `.openai/hosting.json` — private Sites deployment configuration.

To refresh the directory, update the canonical `../mableton-service-directory.json`, then copy it to `dist/services.json`. Keep entry IDs stable to preserve saved favorites. The current copy was researched October 28, 2026. Provider coverage, pilot services, and public-safety transitions must be rechecked before a public launch.

The interface uses local system fonts. There are no external font requests, analytics, tracking scripts, or UI dependencies.

## UI redesign

Apple-inspired system typography, white surfaces, blue actions, and colorful service icons support residents with little technical experience. Home prioritizes everyday services and direct category access; results use readable rows with exact provider names. Each service has explicit Open service, Save/Saved, and More information controls. `DESIGN-CONTRACT.md` records the design decisions.

## Standalone export

Run `python3 scripts/export-standalone.py` to regenerate `../mabletonlink-prototype.html` with the directory and application assets embedded. The served version remains the primary browser-tested artifact.
