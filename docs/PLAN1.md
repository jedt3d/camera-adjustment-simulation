# Exposure Triangle Plan

## Summary

Create page 1, `Exposure Triangle`, as an exposure simulator driven by aperture, shutter speed, and ISO. It should show how brightness, noise, and motion blur change together while using page-specific toolbar and readout content.

## Implementation Status

Implemented first pass in `src/main.ts` and `src/styles.css`: page-specific f-stop, shutter speed, and ISO controls, animated preview, exposure triangle SVG, and computed readouts are live.

## Key Changes

- Add exposure-specific controls for shutter speed and ISO.
- Use the existing f-stop value as the aperture side of the triangle.
- Render a preview scene that changes brightness, noise grain, and motion blur.
- Show compact readouts for exposure value, shutter speed, ISO, aperture, and exposure compensation.
- This page uses its own topic toolbar/readouts instead of the shared page 3/4 camera toolbar/readouts.

## Test Plan

- Verify `npm run build`.
- Verify `npm run test:run`.
- Verify the first top menu button opens `Exposure Triangle`.
- Verify aperture changes affect brightness and depth cues.
- Verify shutter and ISO controls affect motion blur and noise.

## Assumptions

- This page keeps page-specific controls.
- CSS-composed visuals are acceptable for the first-pass implementation.
