# DoCard – Test Plan

## Scope
React Native (Expo) app with Web support. Features in scope:
- Deck CRUD (create, list, delete)
- Card CRUD (text + optional images on both sides)
- Study mode (flip, mark correct/incorrect)
- Results & review wrong cards
- Basic SEO on web (static head tags, robots, sitemap)

## Environments
- Web (Chrome latest) – `npm run web`
- Mobile (Expo Go on iOS) – `npx expo start` + scan/open

## Test Types
- Functional: user stories & flows
- Usability/UX: layout, readability, tap targets
- Non-functional: performance (no obvious jank), offline grace (no crash)
- SEO (Web): static tags render in View Source, robots, sitemap

## Entry / Exit
- Entry: App builds, navigation loads Home.
- Exit: All P0/P1 pass; no blocker bugs; SEO checklist passes.

## Test Cases

### P0 – must pass
1. Create Deck
    - Steps: Home → enter deck title → Create
    - Expected: deck appears in list, counts update
2. Delete Deck
    - Steps: Deck Details → Delete → confirm
    - Expected: deck removed; Home counts update
3. Add Card (text only)
    - Steps: Deck → Add Card → fill front/back → Save
    - Expected: card appears in list; count increments
4. Add Card with images (both sides)
    - Steps: Add Card → attach front image → attach back image → Save
    - Expected: images preview during study
5. Edit Card
    - Steps: Card → Edit → change text → Save
    - Expected: changes visible
6. Study Flow
    - Steps: Deck → Study → Flip → mark Yes/No through all cards
    - Expected: Results screen shows total, correct, incorrect
7. Review Wrong
    - Steps: Results → Review wrong only
    - Expected: only previously wrong cards are queued
8. Web SEO
    - Steps: Open web, right-click “View page source”
    - Expected: `<title>`, description, canonical, OG/Twitter tags visible; `robots.txt` and `sitemap.xml` reachable

### P1 – should pass
9. Search Decks
    - Steps: type in search bar
    - Expected: list filters live
10. Stats on Home**
- Expected: total cards, total decks, avg score show realistic values
11. Responsive Web
- Resize to ~375px width
- Expected: layout remains readable; no overflow

## Risks / Mitigations
- Camera/gallery permissions (Expo Go): instruct user to allow permissions; fallback to gallery if camera blocked.
- iOS device not on same Wi-Fi: use web fallback for presentation.

## Tools
- Manual testing with built-in console logs.
- Chrome DevTools Lighthouse (optional).
