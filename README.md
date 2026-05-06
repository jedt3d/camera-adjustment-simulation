# Camera Adjustment Simulation

Camera Adjustment Simulation is an interactive photography teaching app for exploring how camera settings change visual results. It uses SVG, CSS, and TypeScript to show relationships between focal length, aperture, focus distance, subject distance, background distance, sensor size, perspective, bokeh, exposure, and lens distortion.

The project is designed as a compact learning tool rather than a production camera simulator. The diagrams prioritize clear visual explanation and consistent interaction over exhaustive optical simulation.

## What It Does

The app contains eight interactive pages:

- **Exposure Triangle**: shows how f-stop, shutter speed, and ISO affect brightness, motion blur, and noise.
- **Perspective Compression**: shows how camera distance, subject distance, background distance, and focal length affect apparent background scale.
- **Depth Diagram**: shows a top-view optical diagram with camera body, lens, sensor/film plane, subject, background, field of view, focus distance, near limit, far limit, hyperfocal distance, and actual depth of field.
- **Liveview Simulation**: shows a simplified viewfinder-style scene with a model and urban background using the same camera settings as the depth diagram.
- **Sensor Crop Comparison**: compares full-frame, APS-C, and Micro Four Thirds framing with the same focal length.
- **Bokeh Shape Simulator**: shows simplified aperture blade shape and background highlight behavior.
- **Focus Plane / Zone Focus**: shows near/focus/far markers across a distance scale.
- **Lens Distortion**: shows a simplified grid and portrait comparison for wide, standard, and telephoto-style distortion behavior.

## Purpose

This software is meant to help photographers, students, educators, and visual learners understand camera concepts that are often difficult to see from numbers alone.

The main goals are:

- make camera setting relationships visible and interactive;
- connect technical camera terms to diagrammed behavior;
- support English and Thai photography terminology;
- provide a clean browser-based teaching aid that can be run locally.

## Current Defaults

The default camera setup is:

- Focal length: `50 mm`
- F-stop: `f/4.0`
- Focus distance: `5.0 m`
- Subject distance: `5.0 m`
- Background distance: `15.0 m`

Supported sensor presets are:

- Full frame
- APS-C
- Micro Four Thirds

## Running Locally

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Run the standard verification checks:

```bash
npm run verify
```

Run the full verification suite, including Playwright tests:

```bash
npm run verify:full
```

## Technology

- Vite
- TypeScript
- SVG
- CSS
- Vitest
- Playwright
- Axe accessibility checks

The app intentionally avoids a large frontend framework. Most behavior is written with plain TypeScript, DOM APIs, SVG primitives, and CSS-composed visuals.

## Repository

GitHub repository:

```text
git@github.com:jedt3d/camera-adjustment-simulation.git
```

Web URL:

```text
https://github.com/jedt3d/camera-adjustment-simulation
```

## Project Structure

- `src/core/`: camera constants, optical calculations, formatting helpers, and page metric functions.
- `src/pages/`: page-specific SVG and visual renderers.
- `src/i18n.ts`: English and Thai labels, page titles, summaries, and technical photography terms.
- `tests/e2e/`: Playwright smoke, visual baseline, language, and accessibility tests.
- `PLAN*.md`: design and implementation plans for each page.
- `QUALITY_REPORT.md`: current code quality matrix and verification status.
- `LICENSE`: custom license for source-available non-commercial use.

## License Summary

This project is **not open source** under the Open Source Initiative definition.

The source code is visible and downloadable, but the license intentionally restricts modification and commercial use. Open source licenses normally allow modification, redistribution, and commercial use. This project does not grant those rights by default.

This repository uses a custom license:

**Worajedt Sitthidumrong Source-Available Non-Commercial No-Derivatives License**

In plain language, the license allows you to:

- download and view the source code;
- run the software for personal, educational, evaluation, or other non-commercial purposes;
- share exact, unmodified copies;
- reference the project publicly if you give clear credit to Worajedt Sitthidumrong.

The license does **not** allow you to:

- modify the project;
- create derivative works;
- use it commercially;
- sell it;
- include it in a paid product, paid service, paid course, or monetized offering;
- remove attribution, copyright notices, source notices, or license notices;
- relicense it under another license.

Commercial use, modification, derivative works, sublicensing, paid hosting, or any use outside the granted permission requires prior written permission from Worajedt Sitthidumrong.

See [LICENSE](LICENSE) for the full legal text.

## Licensing Purpose and Options

The licensing goal is to let people learn from and use the project while preserving the author's control over commercial use and derivative works.

The intended permission model is:

- **Free personal or educational use**: allowed when the project remains unmodified and credited.
- **Sharing for reference**: allowed when copies are exact and include the license.
- **Commercial use**: not allowed unless permission is granted separately.
- **Modification or adaptation**: not allowed unless permission is granted separately.

Possible permission options the author may grant separately include:

- commercial usage permission for a specific product, course, organization, or event;
- permission to modify the project for a specific private or public use;
- permission to translate, adapt, or redistribute a modified version;
- a separate commercial license agreement.

Any separate permission should be written clearly and should identify the permitted user, project, scope, duration, and allowed usage.

## Attribution

When attribution is required, use:

```text
Camera Adjustment Simulation by Worajedt Sitthidumrong
```

Attribution must not suggest endorsement by Worajedt Sitthidumrong.

## Important Legal Note

This README explains the project license in practical terms, but it is not legal advice. If you want to rely on this license for enforcement, commercial negotiation, publishing, or distribution, have the license reviewed by a qualified lawyer.
