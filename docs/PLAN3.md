# Interactive Depth Diagram Plan

## Summary

Build a Vite app that renders a responsive, top-down SVG optics diagram. The primary slider controls focal length, followed by f-stop, focus distance, subject distance, and background distance. As camera settings change, the app recalculates depth of field, field of view, image distance, and sensor-scaled image geometry.

## Implementation Status

Implemented as page 3, `Depth Diagram`, using the shared camera toolbar/readouts, modular optics helpers in `src/core/optics.ts`, shared constants in `src/core/constants.ts`, and EN/TH labels from `src/i18n.ts`.

## Key Changes

- Create a Vite frontend with SVG rendering and TypeScript interaction logic.
- Use native SVG so rays, labels, shaded regions, and measurements stay crisp and scalable.
- Add controls for focal length, f-stop, focus distance, subject distance, background distance, and sensor preset.
- Depth Diagram is page 3 in the top menu, after Exposure Triangle and Perspective Compression.
- Keep the shared toolbar/readouts and render the existing top-down SVG depth diagram in the stage.
- Use discrete common focal lengths from 12mm to 135mm rather than arbitrary integer focal lengths.
- Use f-stop steps from f/1.2 to f/16 in one-third-stop-style increments.
- Show computed readouts for focal length, focus distance, actual DOF, near focus limit, far focus limit, and hyperfocal distance.
- Format actual DOF as millimeters below 1cm, centimeters below 100cm, and meters at 100cm or more.

## Diagram Behavior

- Render a top-down scene with a fixed-size camera body, fixed sensor/film plane, fixed lens mount, variable lens barrel, subject plane, background plane, optical axis, field-of-view rays, image-forming rays, shaded depth-of-field region, and distance labels.
- Treat depth of field as a computed optical result.
- Recalculate near/far focus limits with thin-lens / hyperfocal-style formulas using f-stop, focal length, sensor preset, circle of confusion, and focus distance.
- Scale the sensor/film plane and image-side ray cone by the selected sensor width so full frame, APS-C, and Micro Four Thirds visibly produce different image-plane sizes.
- Keep the camera body fixed on screen; only the lens length/curvature and internal optical center move with focal length and focus.
- Keep the camera body approximately 50px from the left edge of the SVG.
- Wide-angle lenses render wider and shorter; standard/telephoto lenses render progressively longer.
- Do not display lens formula names or separate glass-element formula references in the diagram.
- Draw the camera body as a thin mirrorless-style body.
- Draw the subject as a fixed-size simple top-view human shape, without a subject text label.
- Add a focus-distance slider including infinity to demonstrate focusing at a subject distance versus focusing at infinity.
- Animate updates for focal length, ray angle, DOF region, planes, measurements, and labels.

## Formula Defaults

- Full frame: 36mm sensor width, 0.030mm circle of confusion.
- APS-C: 23.5mm sensor width, 0.020mm circle of confusion.
- Micro Four Thirds: 17.3mm sensor width, 0.015mm circle of confusion.
- Default aperture: f/4.0.
- Default focal length: 50mm.
- Default focus distance: 5m.
- Default subject distance: 5m.
- Default background distance: 15m.
- Distance grid displays 0m through 20m.
- Background distance slider supports up to 20m.
- Subject distance slider supports 2m through 15m.
- The 0m distance origin is the sensor/film plane, matching camera focal-plane distance conventions.
- Focal length slider values: 12, 14, 16, 18, 20, 21, 24, 28, 35, 40, 50, 58, 70, 85, 100, 105, 120, 135mm.
- Focus distance slider snaps at 0.1m from 1.2m to 30m, with infinity at the final stop.

## Test Plan

- Verify the app installs and starts with `npm install` and `npm run dev`.
- Verify production build with `npm run build`.
- Verify unit tests with `npm run test:run`.
- Check that each slider/control updates the SVG and readouts without layout shifts.
- Confirm the primary f-stop slider changes actual DOF and near/far focus limits.
- Confirm focal length changes field-of-view rays and DOF consistently.
- Confirm focus distance moves the focus plane and supports infinity focus.
- Confirm sensor preset changes resize the sensor/film plane and image-side ray cone.
- Confirm lens curvature changes as focal length changes.
- Confirm actual DOF switches between mm, cm, and m units at the intended thresholds.
- Confirm near/far DOF limits respond consistently to f-stop, focal length, and sensor changes.
- Check desktop and mobile widths for readable labels, stable controls, and full diagram visibility.

## Assumptions

- The app is a local Vite app, not an embeddable widget.
- The visual target is a clean technical diagram.
- “Depth of view” means photographic depth of field.
- Depth of field is displayed as an output derived from f-stop, focal length, sensor, and focus distance.
- Subject distance and focus distance are separate so the diagram can show a subject that is not necessarily the focus target.
