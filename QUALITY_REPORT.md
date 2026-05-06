# Code Quality Matrix

## Snapshot

- Date: 2026-05-07
- App: Camera Adjustment Simulation, a Vite + TypeScript photography teaching app
- Pages covered: 8
- Verification command: `npm run verify:full`
- Result: PASS

## Quality Matrix

| Dimension               | Score | Status   | Evidence                                                                                                              | Remaining Risk                                                                   |
| ----------------------- | ----: | -------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Build health            | 10/10 | PASS     | `npm run build` passes with TypeScript and Vite production build.                                                     | None currently known.                                                            |
| Unit and DOM tests      |  8/10 | PASS     | Vitest has 5 test files and 20 passing tests covering optics, formatting, i18n, page metrics, and DOM behavior.       | Page renderer modules can get narrower renderer-contract tests next.             |
| Visual regression       |  9/10 | PASS     | Playwright has pixel-baseline screenshots for every page on desktop and mobile.                                       | Baselines are currently platform-specific Darwin snapshots.                      |
| Accessibility checks    |  8/10 | PASS     | Axe checks run for every page on desktop and mobile with no detectable violations.                                    | Manual keyboard-flow review and semantic SVG descriptions can still be deepened. |
| Linting                 |  9/10 | PASS     | ESLint runs clean with TypeScript-aware rules plus moderate complexity and nesting limits.                            | Complexity thresholds can be tightened after renderer-contract tests are added.  |
| Formatting              | 10/10 | PASS     | Prettier check passes across source and docs.                                                                         | None currently known.                                                            |
| Modularity              |  9/10 | IMPROVED | Page renderers, including the depth diagram, now live under `src/pages/*.ts`; core calculations remain in `src/core`. | DOM bootstrap and control wiring still live together in `src/main.ts`.           |
| Internationalization    |  8/10 | IMPROVED | EN/TH title, summary, shared labels, technical terms, and key depth-diagram labels are centralized.                   | Some explanatory SVG strings inside page modules remain English-only.            |
| CI readiness            |  9/10 | PASS     | `.github/workflows/quality.yml` runs install, Playwright browser install, tests, lint, format check, build, and e2e.  | CI has not been executed remotely in this workspace.                             |
| Documentation freshness |  9/10 | PASS     | `AGENT.md`, `PLAN*.md`, and `IMPROVEMENT.md` reflect the current app, scripts, and structure.                         | Keep updated when page renderers are split.                                      |
| Maintainability         |  9/10 | IMPROVED | Repeated calculations and all page renderers were extracted; pure functions and DOM behavior are tested.              | Renderer-contract tests can further protect the extracted page modules.          |

## Verification Evidence

| Command                | Result                    |
| ---------------------- | ------------------------- |
| `npm run test:run`     | PASS: 5 files, 20 tests   |
| `npm run lint`         | PASS                      |
| `npm run format:check` | PASS                      |
| `npm run build`        | PASS                      |
| `npm run test:e2e`     | PASS: 50 Playwright tests |
| `npm run verify:full`  | PASS                      |

## Improvements Implemented

- Added `IMPROVEMENT.md`.
- Added ESLint with `npm run lint`.
- Added Prettier with `npm run format` and `npm run format:check`.
- Added Vitest jsdom configuration.
- Added DOM tests for footer, page switching, Thai switching, and sensor-control visibility.
- Added Playwright e2e visual smoke tests for all pages on desktop and mobile.
- Added Playwright pixel-baseline screenshot regression for all pages on desktop and mobile.
- Added Axe accessibility assertions for all pages on desktop and mobile.
- Added `src/core/pageMetrics.ts` with test coverage for page-specific math.
- Split topic/liveview page rendering into `src/pages/*.ts`.
- Split the depth SVG renderer into `src/pages/depth.ts`.
- Added moderate ESLint complexity and nesting limits.
- Added GitHub Actions quality workflow.
- Added `npm run verify` and `npm run verify:full`.

## Recommended Next Steps

1. Move the remaining explanatory SVG strings in page modules into `src/i18n.ts`.
2. Add renderer-contract tests for each `src/pages/*.ts` module.
3. Split DOM bootstrap/control setup in `src/main.ts` after renderer contracts are in place.
4. Add manual keyboard-flow notes or automated keyboard interaction tests.
5. Consider cross-platform screenshot baselines if CI runs on non-macOS systems.
