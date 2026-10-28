# Resident evaluation and Spanish review kit

Status: prepared, not conducted. No participant recruitment messages have been sent, no sessions invented and no independent translation approval claimed.

## Recruit 5–8 consenting adults

Seek variation in age, comfort with technology and preferred language; include Spanish speakers and people who use assistive technology where possible. Do not infer language from name, address or district. Ask consent before recording; offer notes-only sessions. Use participant codes, not names, in the worksheet. Participants may stop or skip a task. Do not collect account numbers, exact home addresses, medical details or benefit documents.

Suggested opening: “We are testing this website, not you. Please describe what you expect as you use it. Use the fictional scenarios; do not enter private information. We will not send any official requests.”

## Tasks

1. A regular trash pickup was missed and you do not know the provider. Find the next step and explain who performs collection.
2. Waste is dumped near a road. Distinguish immediate danger from a routine concern and find the appropriate reporting route.
3. You need help with rent, then separately need to find a rental. Explain the difference between the two routes.
4. You want a CobbLinc Go trip. Explain what needs to be confirmed before relying on it. Repeat for paratransit certification.
5. You have no computer and need to print a form. Find a place and a telephone alternative; explain what you would ask before visiting.
6. Save and reopen a plan; print or save a PDF. Explain whether any request has been submitted.
7. Switch languages, search for a water bill and recover from an unavailable assistant. Keyboard-only participants should complete the same paths without a pointer.

Record time to first useful step, task completion, moderator assistance, wrong-provider choices, misunderstood labels and whether the resident can explain what happens next. Do not count a link click as successful agency service completion.

| Participant code | Preferred language | Task | Completed without help? | Time | Misunderstanding / observed barrier | Proposed change |
|---|---|---|---|---|---|---|
| pending | | | | | | |

Proposed acceptance: at least 80% of tasks completed without moderator rescue; zero dangerous misroutes or beliefs that MabletonLink already submitted a request; all blocking keyboard/screen-reader issues fixed and retested. With only 5–8 participants, report observations and counts, not population-level certainty.

## Independent Spanish review

A proficient independent reviewer should check all five journeys, 89 service descriptions/applicability fields, UI/error text, official-source labels and printable plans. Record ambiguous vocabulary, regional comprehension and whether the Spanish preserves the same restrictions, operator distinction and urgency. Keep agency proper names where they identify the official provider. Confirm `usted` tone is consistent. Review code enforcement, certification, eligibility and HOA wording especially carefully. Record reviewer role/date and outstanding disagreements; do not write “approved” before review occurs.

## Assistive technology

Automated axe results and accessibility-tree inspection do not replace actual screen-reader use. Test VoiceOver/Safari and, if possible, NVDA/Firefox or Chrome. Check language pronunciation, headings, native dialogs, focus return, live status updates, choice links, favorites toggle state, source disclosures, print action and recovery after a failed request. Native spoken-output verification remains pending; do not claim WCAG certification.

## Model evaluation

Use only synthetic prompts in `tests/routing-benchmark.json`. The local router/guided-path regression is separate from Gemini. After securely configuring a key, run `scripts/evaluate-gemini.mjs` and manually grade relevance, clarifying behavior and supported service choices in both languages. Model scope is probabilistic even though URLs and displayed facts are constrained. Never change expectations just to make a score pass. Preserve failures and new regression examples.
