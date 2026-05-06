# Agent Handoff

## Project

Camera Adjustment Simulation is a small Vite + TypeScript photography teaching app with eight interactive pages. It renders with inline SVG/CSS-composed visuals and plain DOM controls.

Remote repository: `git@github.com:jedt3d/camera-simulation.git`

## Commands

- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Build: `npm run build`
- Run unit tests once: `npm run test:run`
- Run unit tests in watch mode: `npm run test`
- Run Playwright visual smoke tests: `npm run test:e2e`
- Run standard verification: `npm run verify`
- Run full verification including Playwright: `npm run verify:full`
- Preview production build: `npm run preview`

## Main Files

- `src/main.ts`: app state, DOM bootstrap, routing, shared controls, and page orchestration.
- `src/core/types.ts`: shared app, sensor, page, and optical model types.
- `src/core/constants.ts`: sensor presets, lens/aperture/shutter/ISO steps, default state, diagram world constants.
- `src/core/optics.ts`: testable depth-of-field, crop, image-distance, model-building, and defocus calculations.
- `src/core/pageMetrics.ts`: testable page-specific calculations for exposure, perspective, crop, bokeh, and distortion behavior.
- `src/core/format.ts`: testable clamp and unit-formatting helpers.
- `src/core/*.test.ts`: Vitest unit tests for core optics and formatting behavior.
- `src/app.dom.test.ts`: Vitest jsdom tests for footer, page switching, language switching, and sensor-control visibility.
- `src/pages/*.ts`: extracted SVG/CSS page renderers, including the depth diagram.
- `tests/e2e/app.spec.ts`: Playwright desktop/mobile smoke, screenshot-baseline, Thai language, and Axe accessibility tests.
- `tests/e2e/app.spec.ts-snapshots/`: platform-specific Playwright screenshot baselines.
- `src/i18n.ts`: EN/TH page titles, summaries, shared labels, and photography terms.
- `.github/workflows/quality.yml`: CI workflow for install, tests, lint, format check, build, and visual smoke tests.
- `IMPROVEMENT.md`: quality improvement plan and implementation status.
- `QUALITY_REPORT.md`: current code-quality matrix, verification evidence, and remaining risks.
- `src/styles.css`: layout, SVG styling, responsive behavior.
- `index.html`: Vite entrypoint.
- `PLAN1.md`: Exposure Triangle page plan.
- `PLAN2.md`: Perspective Compression page plan.
- `PLAN3.md`: Depth Diagram page plan.
- `PLAN4.md`: Liveview Simulation page plan.
- `PLAN5.md`: Sensor Crop Comparison page plan.
- `PLAN6.md`: Bokeh Shape Simulator page plan.
- `PLAN7.md`: Focus Plane / Zone Focus page plan.
- `PLAN8.md`: Lens Distortion page plan.

## Implementation Notes

- Keep the optics model separate from SVG rendering when extending behavior.
- The app is intentionally framework-light: Vite + TypeScript, plain DOM, SVG, CSS, and Vitest.
- The primary slider is focal length, followed by f-stop, focus distance, subject distance, and background distance.
- Focal length is selected from common lens values between 12mm and 135mm.
- F-stop is selected from one-third-stop-style values between f/1.2 and f/16.
- Default settings are 50mm, f/4.0, 5m focus distance, 5m subject distance, and 15m background distance.
- Top menu buttons should use the same rectangular visual language as the bottom readout boxes.
- Pages currently appear in this order: Exposure Triangle, Perspective Compression, Depth Diagram, Liveview Simulation, Sensor Crop Comparison, Bokeh Shape Simulator, Focus Plane / Zone Focus, Lens Distortion.
- Pages 1, 2, and 5-8 now have first-pass interactive diagrams with page-specific toolbar controls and readouts.
- Depth Diagram is page 3 and Liveview Simulation is page 4.
- Pages 1, 2, and 5-8 use `topicControls` and `plannedReadouts`; pages 3 and 4 use the shared camera toolbar/readouts.
- Page rendering is split into `src/pages/*.ts`; `src/main.ts` should stay focused on DOM bootstrapping, routing, control state, and orchestration.
- The app/project name is `Camera Adjustment Simulation`; page 3 is still labeled `Depth Diagram`.
- The `Top View` eyebrow should only appear on the Depth Diagram page; every other page hides it.
- The EN/TH language dropdown lives at the right side of the top menu and updates menu labels, page title, page summary, main controls, and page readout labels.
- Footer contains `Copyrights © 2026 by Worajedt Sitthidumrong` and a `Source code` label.
- Project-owned source files carry a copyright header with the same message. Do not add headers to generated `dist` files or third-party `node_modules`.
- Thai terminology should follow camera-maker Thai usage where possible: `รูรับแสง`, `ความเร็วชัตเตอร์`, `ความไวแสง ISO`, `ความยาวโฟกัส`, `ระยะชัดลึก`, `ความพร่ามัว`, `โบเก้`, and `เซนเซอร์ภาพ`.
- Only pages 3 and 4 are locked to the current camera-depth toolbar/readouts; other pages may replace toolbar/readout content as their topics require.
- Top menu buttons should wrap to multiple lines if needed, fit the page width without horizontal scrolling, and use smaller non-bold text.
- Liveview Simulation renders a CSS-composed model foreground, urban/city background, bokeh highlights, thirds grid, focus box, vignette, and compact HUD.
- Liveview must reuse the same optical model as the depth diagram: focal length, f-stop, focus distance, subject distance, background distance, and sensor preset all affect the preview.
- Liveview behavior: focal length and sensor preset change crop/framing; f-stop and distance mismatch change blur/bokeh; focus distance determines whether model or background is sharpest.
- The camera body, sensor/film plane, and mount are fixed-size/fixed-position; only the lens barrel/curvature and optical center change.
- The camera body is fixed near 50px from the left edge of the SVG.
- The camera is drawn as an optical cutaway: fixed body, fixed sensor/film plane, fixed mount, variable lens, optical center, sensor-width-scaled image rays, and sensor-to-lens-front distance.
- Do not display lens formula names or separate glass-element formula references in the diagram.
- The camera body should read visually as a thin mirrorless-style body.
- Draw the subject as a fixed-size simple top-view human shape, without a subject text label.
- Sensor presets currently define sensor width and circle of confusion:
  - Full frame: 36mm / 0.030mm
  - APS-C: 23.5mm / 0.020mm
  - Micro Four Thirds: 17.3mm / 0.015mm
- Actual DOF, near limit, far limit, and hyperfocal distance are derived from the current f-stop, focal length, focus distance, and sensor preset.
- Actual DOF unit formatting is dynamic: mm below 1cm, cm below 100cm, m at 100cm or more.
- Sensor/film plane height and the image-side ray cone must remain proportional to `sensor.widthMm` when changing full frame, APS-C, and Micro Four Thirds.
- Focus distance is separate from subject distance, snaps at 0.1m, and includes an infinity endpoint after 30m.
- The SVG viewBox is wide enough to show a 0m-20m distance grid.
- Distance scale origin is the sensor/film plane, not the lens mount.
- Subject distance slider range is 2m to 15m.
- Exposure Triangle uses page-specific f-stop, shutter speed, and ISO controls to change brightness, motion blur, noise, EV, and exposure bias.
- Perspective Compression uses focal length, subject distance, and background distance controls to show subject framing and background scale.
- Sensor Crop Comparison renders synchronized full-frame, APS-C, and Micro Four Thirds previews without implying the lens focal length changes.
- Bokeh Shape Simulator renders a simplified aperture blade diagram and defocused highlight field controlled by f-stop, focal length, focus/background distance, and blade count.
- Focus Plane / Zone Focus renders a 0m-20m ground-plane sharpness zone with near/focus/far markers and subject status.
- Lens Distortion renders a reference/warped grid and portrait comparison driven by focal length and subject distance controls.
- Do not show sensor size dropdowns on pages whose geometry/readouts do not depend on sensor size. Current sensor-dependent pages are Depth Diagram, Liveview Simulation, Sensor Crop Comparison, and Focus Plane / Zone Focus.

## Design Constraints

- Preserve the technical-diagram feel: compact controls, clear labels, measurement lines, and no decorative marketing sections.
- Prefer SVG primitives for diagram geometry so the result remains crisp and inspectable.
- Avoid adding framework complexity unless the app grows beyond this single interactive view.
