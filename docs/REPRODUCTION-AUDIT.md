# Free reproduction audit — October 28, 2026

This is a developer-tooling audit by an AI specialist, not a judge-access test by an external person or organizer approval. The tested source snapshot is `13da41c15e256d0d178e5b387d2c673e7597fb0a`. Parent integration changes after that snapshot need their own final package check.

## Result

A fresh source copy installs, builds and runs locally without a Google API key, Cloudflare login, payment method or paid hosting. English and Spanish directory/guidance assets can therefore be reproduced without an account. Live Gemini answers are a separate optional capability: they require a suitable Google account, the judge's own server-side key, current model access and available free quota. The no-key check below verifies the explicitly unavailable API path; it does not impersonate a live AI answer.

No app code/configuration, hosted access, billing, keys or production settings were changed during this audit. No dependencies, `.dev.vars`, local environment files, Git metadata or tool-runtime state were copied into the clean test tree.

## Fresh-source evidence

A `git archive HEAD` snapshot was extracted to `/tmp/mableton-repro-audit-3i3qacwi`. Tests used macOS, Node **24.15.0**, npm **11.12.1**, and Python **3.13.0**. The package declares Node ≥22.13.0; this audit did not test every supported version or Windows/Linux. npm reused the normal package cache and could reach the registry; this is a fresh install, not a zero-network installation guarantee.

| Check | Observed result |
|---|---|
| `npm run install:ci` | Exit 0; 223 packages installed in 16 seconds. Two upstream esbuild-kit deprecation notices, no install failure. |
| `npm test` | Exit 0; 34 tests passed, zero failed. |
| `npm run build` | Exit 0; portable default selected without a checkout-local execution profile. `/` and `/api/assistant` built. |
| Documented local D1 migration | Exit 0; two SQL commands succeeded against the local placeholder database. No remote migration or Cloudflare authentication. |
| Local Wrangler server at `127.0.0.1:4193` | Home returned HTTP 200 with no Authorization header or browser cookies. |
| English synthetic question, no key | HTTP 503, `status: unavailable`, `code: not_configured`. |
| Spanish synthetic missed-pickup question, no key | HTTP 503, `status: unavailable`, `code: not_configured`. |
| Spanish synthetic breathing emergency, no key | HTTP 200, `status: emergency`; local safety handling works without Gemini. |
| Server cleanup | Audit server exited after SIGTERM. No audit development server was left running. |

The local database command was:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_premium_ben_urich.sql
```

Apply it once to a fresh local database. After the preceding install/build steps, the documented `npm run start` command is sufficient; `npm run start -- --port 4193` selects a nondefault port. The audit invoked its equivalent Node/Wrangler command directly so its process could be stopped reliably. No `.dev.vars` is needed for no-AI review.

## Standalone export

`python3 scripts/export-standalone.py` exited 0 and generated a **260,367-byte** HTML file. Snapshot SHA-256: `9e40c0a302310195ccf3b015b8bca71c5ccabe01740ab61fd2b6023147f4cb31`. This hash describes this audit snapshot only, not a later translated or corrected export.

Static inspection confirmed:

- One inline module, **zero module imports**, zero external script `src` attributes, and zero stylesheet links; the CSS and favicon are embedded.
- **89 English records, 89 Spanish records and five guided journeys** are embedded as JSON.
- The extracted inline module passed `node --check`.
- Directory loading is replaced with the embedded data. The remaining `/api/assistant` request is optional and its failure invokes directory guidance.
- Browser storage reads/writes catch failures. Persistent favorites/plans still depend on the browser permitting storage for the chosen origin.

**Direct `file://` rendering is unverified.** The browser control's URL policy rejected that protocol and allowed only HTTP(S). No alternative browser or protocol workaround was attempted. Static syntax and self-containment do not prove file-origin execution, storage persistence or printing behavior in every browser. Do not advertise this audit as a successful double-click/file-origin test.

For a predictable, account-free judge path, include the standalone file and document a local HTTP origin:

```sh
python3 -m http.server 4177 --bind 127.0.0.1 --directory artifacts
```

Then open `http://127.0.0.1:4177/mabletonlink-prototype.html`. This is a proposed standalone review route; the parent must verify its actual UI before labeling the packaged artifact browser-tested. It serves files locally, uses no hosting account/card, and has no Gemini backend. Close the server with Ctrl+C. Official websites still need Internet access. An exported file is not a guarantee that a fresh visit to the hosted website works offline.

## Judge package contents and claims

Recommended package:

1. `START-HERE.md` with the standalone path, Python local-server command, five-minute story, limits, and a clear statement that no agency request is submitted.
2. The regenerated standalone HTML and checksum, tested after all final content fixes.
3. A source snapshot containing the lockfile, app/public/server/db/drizzle/lib/worker sources, build scripts/config, `.openai/hosting.json`, `.env.example`, relevant docs and tests.
4. Exact source revision or source manifest and recorded test evidence.

Exclude `node_modules`, `.git`, `.dev.vars`, all actual secret environment files, `.wrangler`, `.sites-runtime`, credentials, user data and development logs. Keep the shipped `scripts/vite/sites-vite-plugin.LICENSE` attribution. The application currently has no top-level software license, so do not describe it as an openly licensed project without the owner's licensing decision; this audit makes no redistribution-rights determination for every dependency.

A local no-key path has now been executed. Initial dependencies/toolchain installation can require Internet access. The standalone route does not reproduce live AI, and the no-key source check does not establish a fresh Google account's exact free allowance. The separate private hosted URL must pass a no-owner-credentials access check before being presented as judge-accessible. Organizer acceptance remains an external decision.
