# Sensor Crop Comparison Plan

## Summary

Create page 5, `Sensor Crop Comparison`, as a side-by-side visualization of full frame, APS-C, and Micro Four Thirds framing using the same lens and subject settings.

## Implementation Status

Implemented first pass in `src/main.ts` and `src/styles.css`: synchronized full-frame, APS-C, and Micro Four Thirds preview panels now respond to lens and distance settings.

## Key Changes

- Render three synchronized preview panels.
- Show full frame, APS-C, and Micro Four Thirds crop boxes or separate live previews.
- Reuse the existing focal length, subject distance, and background settings.
- Display effective field-of-view differences without implying focal length physically changes.

## Test Plan

- Verify `npm run build`.
- Verify `npm run test:run`.
- Verify the fifth top menu button opens `Sensor Crop Comparison`.
- Verify smaller sensors crop tighter than full frame.
- Verify focal length changes all panels consistently.

## Assumptions

- Sensor presets remain full frame, APS-C, and Micro Four Thirds.
- The page explains crop visually, not as “equivalent focal length” unless explicitly labeled.
