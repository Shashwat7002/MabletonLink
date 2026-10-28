# MabletonLink accessibility review

Date: October 28, 2026. Scope: the MabletonLink LaunchPad, its directory, favorites, search, information dialogs, and directory assistant demo. Target: WCAG 2.2 AA and practical use by older and nontechnical residents.

## Result and important limit

The barriers confirmed by browser accessibility trees, keyboard operation, and enlarged-layout checks were fixed. Axe-core 4.14.0 reported **zero violations in 19 recorded interface states**. This is not a claim of complete WCAG conformance or a completed screen-reader acceptance test.

**Actual VoiceOver spoken-output verification is incomplete.** VoiceOver was enabled on macOS 26.5 with the user's volume unchanged and muted. Its welcome dialog was completed, and VoiceOver Utility showed the caption panel enabled. The automation interface could not access the separate VoiceOver caption window: direct access timed out and Safari screenshots did not include it. The attempted rotor shortcut did not produce observable rotor output. No speech, rotor, or live-announcement pass is inferred from the browser accessibility tree. VoiceOver was restored to off; VoiceOver Utility and System Settings were closed. A subsequent process check confirmed no VoiceOver process remained.

The Mac briefly locked; the user unlocked it and native Safari checks resumed. Safari 26.5 was tested at a verified **200% page zoom**, then restored to 100%. Only the test window was closed. No volume settings were changed.

## Findings and fixes

| Evidence / severity | Resident impact | Change | Verification / related criterion |
| --- | --- | --- | --- |
| Confirmed, high: native Safari's accessibility tree exposed each service as a single named link, omitting its visible heading and description. Removing the custom label alone did not restore those children. | Heading navigation could not find individual services, and descriptions were unavailable. | Service headings, providers, and descriptions are semantic siblings of a clearly named website link. A CSS link area retains the large clickable surface. | Safari and in-app browser now expose each H3 and description separately. Links identify the service and new-tab behavior. 1.3.1, 2.4.6. |
| Confirmed, high: selecting an assistant prompt hid its focused button and left `document.activeElement` on BODY. | Keyboard and screen-reader users lost their place when the answer appeared. | Each answer has a focused “Suggested services” heading associated with the answer paragraph. The next Tab reaches its first service link. | Focus becomes `reply-title-N`; Tab reaches the relevant website. Escape returns to Help. 2.4.3. Spoken wording still needs VoiceOver verification. |
| Confirmed, high: at 320px with increased text spacing, the assistant header grew to 187px while the focused reply started at 130px, underneath it. | Enlarged text concealed the beginning of the answer. | Scroll clearance follows measured header/navigation heights, including resize and dialog opening. | Retest: focused reply starts at 227px, below the 187px header, without horizontal overflow. 1.4.12; focus visibility usability. |
| Confirmed, medium: saved controls displayed “Saved” but had the accessible name “Remove … from favorites.” | Visible and spoken labels described different actions. | Ordinary action buttons now consistently say Save or Remove, with matching accessible names; saved buttons retain a check mark and inverted styling. | Names/labels checked in saved, unsaved, Home, Favorites, and dialog states. 2.5.3, 4.1.2. |
| Confirmed, medium: most route links retained focus in the previous navigation position; Home favorite changes rebuilt the entire directory. | Residents had to rediscover the new content; repeated DOM replacement could disrupt reading position. | Route changes and browser Back focus the new H1. Home updates its favorites section while keeping essential cards intact. Removing the last favorite focuses the empty-state explanation. | H1 focus checked on navigation and Back; last removal focuses `empty-title`. 2.4.3. Virtual-cursor stability requires final assistive-technology verification. |
| Confirmed, medium: a question consisting of spaces was silently ignored. | Users got no explanation or way to understand the failure. | A visible, associated error explains what to enter, marks the field invalid, and focuses it. Editing clears the error. Enter creates a normal textarea line break; Send submits. | Empty/whitespace error, valid recovery, input association, and focus verified. 3.3.1, 3.3.2. |
| Confirmed, medium: removing a favorite from its information dialog removed the original opener; Escape then left focus on BODY. | Residents lost their place after completing the action. | Closing a dialog falls back to the results heading when its opener no longer exists. | Reproduced before the fix; retested with result-heading focus after Escape. 2.4.3. |
| Confirmed in source: the global single-character `/` shortcut had no off switch or remapping. | Speech-input users could trigger search unintentionally. | Removed the unnecessary global shortcut; the visible search field and skip link remain available. | Pressing `/` from a navigation link no longer moves focus. 2.1.4. |
| Risk remediated: live results changed on every character; toast feedback depended on visibility toggling; background announcements were unsuitable inside a modal. | Important updates might be missed or compete with typing. | Results announcements wait 450ms after input; explicit Search focuses a result heading. Persistent action status and dialog-local status regions expose feedback. Assistant replies use deliberate focus instead of a competing live log. | DOM status messages, timing, focused destinations, and modal feedback verified. 4.1.3; actual announcements remain unverified. |
| Confirmed, moderate automated finding: location/emergency content was outside landmarks. | Landmark navigation could skip that content. | A named complementary landmark identifies location and emergency assistance. | Axe region check passes. Best practice supporting 1.3.1. |
| Usability improvements: some secondary external links lacked a new-tab indication; loading errors left search apparently available. | Navigation and error recovery were less predictable. | Every external link has a new-tab cue. Search/help controls are disabled while unavailable; retry success focuses the page heading and provides status. | External-link names, simulated request failure, successful retry, and button states verified. New-tab cue is a usability enhancement, not by itself a claim of an AA failure. |

## Verification performed

- **Native Safari accessibility tree:** service headings/descriptions exposed independently; named search and dialogs; correct focused element after searching and opening/closing details.
- **Native keyboard at 200% zoom:** search using Return; Option-Tab through service link, Save, and information; Space opens information; subsequent link receives visible focus and scrolls into view; Escape returns to the information button. Content remained readable without clipped controls in the inspected views.
- **Keyboard in the in-app browser:** skip link moves to main and next Tab reaches search with a 3px outline; navigation/category/Back focus; Search result heading; load more reaches the first newly added service (index 18 of 36); dialog reverse-Tab/Tab wrap; Escape restoration; prompt/typed reply focus; first answer link; error recovery.
- **Search:** water bill returns one service; no-match query produces a zero-result status; clear filters recovers; Schools & childcare has 10 services; Courts & legal help has five.
- **Favorites:** save, reload persistence, matching Remove action, removal, empty state, and dialog-local feedback. Test favorites used localhost only. Existing storage key and service IDs are unchanged.
- **Recovery:** blocked `services.json` request produced the visible error and unavailable controls; unblocking and Try again restored the directory, focus, and status. A temporary storage-write exception produced “Saved for this visit only” feedback. All request blocking and storage overrides were removed by resetting/reloading.
- **Reflow and spacing:** 320 × 568 viewport; document width equals 320px. Letter spacing 0.12em, word spacing 0.16em, line height 1.5, paragraph bottom spacing 2em. No horizontal overflow in the checked page or assistant. Temporary styles and viewport override were removed.
- **Contrast:** black and white text/surfaces remain 21:1. Axe's remaining *incomplete* contrast items concern content scrolled behind the sticky assistant header, not calculated contrast failures. The disclosure passes when fully visible; focused reply clearance was separately measured and visually inspected. Increased spacing also produces offscreen/partially covered text requiring this manual assessment.
- **Automated scan:** axe-core 4.14.0, WCAG 2 A/AA, 2.1 AA, 2.2 AA tags plus best practices. [Recorded results](accessibility/axe-results.json) contain 19 states, all with zero violations. Some states have explicit incomplete contrast checks as described above. Automated checks do not test speech output or certify usability.
- **Preserved:** all 89 researched service entries, official URLs, category IDs, favorite storage key, no-SSO behavior, deterministic assistant disclosure, and black/white design.

Local visual evidence: [assistant on a narrow screen](artifacts/accessibility-mobile.jpg), [increased text spacing](artifacts/accessibility-text-spacing.jpg), [native Safari at 200%](artifacts/accessibility-safari-200.jpg).

## Still required for full screen-reader acceptance

A person or test harness that can observe actual VoiceOver speech/captions should complete this short sequence on Safari:

1. Use the rotor to reach the main landmark, H1, Everyday essentials H2, and individual service H3s. Read the service description and website link.
2. Type “water bill” in search. Confirm the settled result count is announced once, typing focus stays in the field, and Search moves to the result heading.
3. Save a service, open Favorites, remove it, and confirm the action and empty state are understandable without sight.
4. Open service information. Confirm its dialog name, trapped navigation, local saved feedback, and return focus after Escape.
5. Open Help, choose a suggested question, and confirm the answer heading and description are spoken once in a sensible order. Reach each source link and the question field.
6. Submit a blank question, correct it, reset the conversation, and verify error and reset announcements.
7. Check categories, browser Back, load more, and the load-error/retry path. Repeat with enlarged text.

NVDA/Firefox or Chrome on Windows, iOS VoiceOver, Android TalkBack, braille output, and sessions with older residents were not tested. External agency websites and their sign-in/payment flows are outside this review.

## References used

- [Apple VoiceOver general commands](https://support.apple.com/guide/voiceover/general-commands-cpvokys01/mac)
- [Apple VoiceOver caption panel](https://support.apple.com/en-kw/guide/voiceover/unac078/mac)
- [W3C: Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [W3C: Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)
- [W3C: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
