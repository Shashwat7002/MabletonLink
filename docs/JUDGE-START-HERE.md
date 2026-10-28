# MabletonLink: judge review and free reproduction

This is an independent prototype for finding Mableton-area services, in English or Spanish. It does not submit requests, collect payments, access accounts or issue confirmation numbers. All examples below are fictional; do not enter personal information.

## Start without an account, API key or credit card

The downloadable judge ZIP includes `mabletonlink.html`, source code, review evidence and a checksum manifest. `RELEASE-CHECKS.json` records final publication and package verification after the source commit; source ledgers may describe the prepublication checkpoint. Extract the entire ZIP. Open a terminal in its `MabletonLink-judge` folder and run:

```sh
python3 -m http.server 4177 --bind 127.0.0.1
```

On Windows with Python Launcher, use `py -m http.server 4177 --bind 127.0.0.1` instead. Open **http://127.0.0.1:4177/mabletonlink.html** in a modern browser. Stop the server with Ctrl+C when finished. Python and a browser must already be installed. macOS was tested; the Windows command is standard Python usage but was not tested here.

The single HTML file contains all directory data, styles and application code. Local search, categories, Spanish guidance, favorites and printable plans work without Google or hosted-site access. Favorites and plans remain in that browser. External official websites require Internet access. The local standalone server has no AI backend: a question receives explicitly labeled directory guidance. This is not a fabricated Gemini response. Direct double-click/file-origin behavior is not claimed as tested.

## One complete story: missed pickup

1. From English Home, choose **Trash pickup**, then **My regular pickup was missed**.
2. Choose **I am not sure**. The correct next step is identifying the actual private hauler from the bill/container label/property manager. The city approves haulers; it does not collect the trash. Do not invent a specific company for an unknown address.
3. Switch **Language / Idioma** to **Español**. The same outcome stays open with the clearer Spanish explanation and approved official link.
4. Choose **Guardar este plan**. Open **Favoritos** and reopen **Identifique primero la empresa que recoge su basura**.
5. Choose **Imprimir o guardar como PDF**. The plan includes source links and says **No se ha enviado ninguna solicitud**. It is guidance, not a receipt.
6. Open **Pregunte a MabletonLink** and enter the synthetic phrase **No recogieron mi basura**. In this no-backend copy the answer is explicitly labeled **Orientación del directorio: la IA no está disponible**. Follow the guided choice; the journey still works.

## Full source reproduction, optional live Gemini

The `source/` folder contains the exact application revision in `SOURCE-REVISION.txt`, a dependency lockfile, tests and setup instructions. With Node ≥22.13 (tested Node 24.15/npm 11.12), run from `source/`:

```sh
npm run install:ci
npm test
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_premium_ben_urich.sql
npm run start
```

Apply the database migration once on a fresh local database. Read the server's printed local URL. Initial package installation needs Internet access. No Cloudflare login, hosted account, billing or API key is required for this local no-AI path; see `docs/REPRODUCTION-AUDIT.md` for the clean-copy test.

To reproduce live AI, follow `GEMINI-SETUP.md` using your own private Google AI Studio key, server-side only. Keep billing disabled. The selected model is **Gemini 3.1 Flash-Lite**. Free availability and quota depend on the Google project; the owner's observed allowance is not a guarantee for a new account. Never use a supplied developer key: the package contains none.

## Hosted link and evidence limits

Hosted site: https://mabletonlink-launchpad.himanshu-k-cd.chatgpt.site

The owner authorized public sharing on October 28, 2026. The platform's public access setting alone does not establish logged-out access; see `docs/DEADLINE-READINESS.md` and `tests/evidence/judge-access.json` for the latest actual check. The local package is the no-account reproduction route.

Read `docs/DEADLINE-READINESS.md` for current model, browser and review results. Five specialist AI walkthroughs are not five human sessions. Human resident/nonresident participants and human Spanish reviewers remain zero. No human completion-time or improvement claims are made. Source details and maintenance responsibilities are in `docs/SOURCES.md` and `docs/MAINTENANCE.md`. Organizer acceptance remains an external decision.
