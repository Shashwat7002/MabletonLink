# GitHub and Vercel deployment

The production interface is deployed from `Shashwat7002/MabletonLink` to **https://mabletonlink.vercel.app** on Vercel. The repository is private; visitors do not need GitHub, Vercel or ChatGPT accounts to use the production website. Pushes to `main` trigger production deployments.

Verified October 28, 2026: the homepage and four application/data assets return HTTP 200 without cookies or authorization; the English water-bill assistant request returns the approved record, a signed session cookie and `Cache-Control: no-store`; a request with an unrelated Origin returns 403. All 40 backend/gateway tests pass. Use a Git email associated with the repository owner's GitHub account: Vercel rejected the Mac's auto-generated `.local` commit email until this repository was configured with the owner's GitHub no-reply address.

`vercel.json` builds the static interface with `node scripts/build-vercel.mjs`. There are no frontend runtime dependencies to install. Vercel discovers `api/assistant.mjs` as a Node.js function. It accepts only same-origin JSON POST requests, bounds request/response sizes, forwards only the signed assistant session cookie, and contacts one fixed backend URL. The browser continues to use `/api/assistant` on its own origin. No CORS wildcard or client-side API key is used.

The existing Cloudflare Worker at `https://mabletonlink-launchpad.himanshu-k-cd.chatgpt.site` remains the assistant backend. Gemini credentials, the approved directory, request/output validation and D1 usage counters remain there. Do not disable that backend while this gateway is in use. Repository pushes redeploy the Vercel interface/gateway automatically; edits to `server/assistant.mjs`, `server/policy.mjs` or the server's directory must also be published to the existing Worker through the documented Sites workflow.

The gateway preserves signed per-session and global limits. The Worker's network limit sees Vercel's outbound IP, so visitors may share a 60-request/hour network bucket. It deliberately does not trust a forwarded IP supplied by the client. Quota/provider failures retain the directory fallback; no unlimited-use promise is made. No new paid service or database is required by this configuration.

Run `npm test` and `node scripts/build-vercel.mjs` before pushing. In Vercel import the repository into the existing Hobby team, use the Other framework preset and the checked-in configuration. Production must be accessible without Vercel authentication. Preview-deployment protection may stay enabled.

Implementation references: [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js) and [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).
