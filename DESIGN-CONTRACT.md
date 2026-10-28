# MabletonLink monochrome interface

User direction: a very simple black-and-white interface, inspired by Apple’s minimalism, prioritizing understanding and usability for nontechnical and older residents.

## Visual thesis

A readable service directory with a single obvious next step. White is the only surface color and black the only ink/action color. No gradients, shadows, translucent panels, colored icons, faint text, or decorative motion. Spacing, type size, line borders, underlines, and explicit words establish hierarchy. Selected navigation and saved favorites reverse to white on black; their words and programmatic states also identify the change.

System fonts; 18px body text, 16px provider and secondary text, 22px service names, 48px desktop and 34px phone page heading. Main controls target 48–52px; mobile navigation labels remain 14–15px. No fixed card heights, text clipping, or disabled zoom. Search has a persistent visible label. Service links say Open website. Save/Saved, More information, Close, and Send are visible labels.

## Structure and behavior

Home prioritizes search, common service cards, direct category access, favorites, and the category directory. Desktop uses two service columns and three category columns; phone uses a single reading column. Home, All services, Favorites, and Help remain predictable.

All 89 services, provider names, source URLs, applicability notes, and existing local favorites remain intact. No application login or SSO. Assistant is explicitly a directory demo and cannot act on residents’ behalf. Dialogs scroll naturally at short heights; the Close control stays visible. New answers scroll to their beginning. Result counts announce through a persistent polite live region.

## Verification boundary

Check desktop and phone layouts, 320px reflow, large/zoomed text, visible focus and keyboard dialog behavior, search/category filtering, saved states, and assistant reading order. Black/white foreground contrast is 21:1. Automated and visual checks are evidence, not a claim of full WCAG conformance or tested screen-reader usability. A live screen-reader and older-resident usability study remain follow-up validation.
