# Code Quality Improvement Plan

## Goals

- Keep the app easy to change as the number of photography teaching pages grows.
- Protect the optics/math behavior with unit tests.
- Protect page switching, language switching, and core UI contracts with DOM tests.
- Add repeatable linting, formatting, build, and visual smoke checks.

## Implementation Steps

1. Split `src/main.ts` further by extracting testable pure calculation helpers first, then move page renderers into page modules as the next refactor.
2. Add DOM-level tests for page switching, language switching, footer rendering, and sensor dropdown visibility rules.
3. Add Playwright smoke screenshot tests for representative pages at desktop and mobile sizes.
4. Continue moving all user-facing strings into `src/i18n.ts`.
5. Add ESLint and Prettier with project scripts.
6. Add a CI-ready verification command set: unit tests, e2e smoke tests, lint, format check, and production build.
7. Extract repeated page render math into pure functions with unit tests.
8. Improve accessibility coverage with clearer labels, page titles, and keyboard-friendly controls.

## Implemented In This Pass

- Added this improvement plan as `IMPROVEMENT.md`.
- Added ESLint and Prettier configuration and scripts.
- Added Vitest jsdom configuration and DOM tests.
- Added Playwright configuration, visual smoke tests, and pixel-baseline screenshot tests.
- Added Axe accessibility assertions to Playwright.
- Extracted page metric calculations into `src/core/pageMetrics.ts` with unit tests.
- Split topic/liveview page renderers into `src/pages/*.ts`.
- Extracted the depth SVG renderer into `src/pages/depth.ts`.
- Centralized additional depth-diagram labels in `src/i18n.ts`.
- Added moderate ESLint complexity and nesting limits.
- Added a GitHub Actions quality workflow.
- Added `npm run verify` and `npm run verify:full`.
- Added `QUALITY_REPORT.md` as the current code-quality matrix.

## Follow-Up Work

- Convert the remaining explanatory page-module SVG strings into i18n terms.
- Add renderer-contract tests for each `src/pages/*.ts` module.
- Split DOM bootstrap and control wiring in `src/main.ts` after renderer contracts are covered.
