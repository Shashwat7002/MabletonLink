# MabletonLink redesign contract

Audience: residents who may have little technical experience. Their primary task is to recognize a service, understand which organization provides it, and open the correct official website. This is an Apple-inspired resident app, not an official Apple or City of Mableton product.

## Visual thesis

A familiar home screen for everyday life in Mableton. Use clear system typography, white surfaces on a quiet gray canvas, generous targets, and blue actions. Colorful rounded-square service icons provide the signature; decorative headlines and competing sidebars are removed.

Tokens: canvas #F5F5F7, surface #FFFFFF, ink #1D1D1F, secondary #515154, action #0066CC, border #D2D2D7. System sans typography, 44px desktop / 32px mobile heading, 18–20px service titles, 16px body, 14px secondary text. An 8px spacing foundation; 44px minimum interaction targets.

## Interaction contract

- Home, All services, and Favorites are always recognizable. Use top navigation on desktop and labeled bottom navigation on phones.
- Search and a real service are visible in the first phone viewport. Categories are one clear action away; the home page also includes all 15 categories.
- Preserve all 89 entries and existing IDs, official URLs, and browser-local favorites.
- Every service shows its actual provider in readable sentence case, an Open service action, More information, and visible Save / Saved state. Never label Georgia Power as the state government.
- Use compact rows for full-directory and search results, and larger cards for common tasks.
- The assistant is an on-demand sheet. Before typing, explain that this demo suggests directory links and cannot contact agencies or complete requests. Do not imply a live AI model or access to resident accounts.
- Keep emergency access visible and label external website behavior. No application accounts or SSO.

## Finish gate

Verify desktop 1440px, tablet 768px, and phone 390px plus narrow reflow. No clipped names, hidden providers, horizontal overflow, or overlapping navigation. Verify search, category filters, no results, saved/empty favorites, persistence, details, assistant, Escape, focus restoration, and error recovery. Main controls must be at least 44×44px. Measure text/control contrast; do not claim full accessibility conformance without assistive-technology testing.

UI Designer and UI Finish-Gate Reviewer are advisory and independent review roles. Root owns implementation and publication.
