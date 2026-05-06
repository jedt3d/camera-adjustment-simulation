# Bokeh Shape Simulator Plan

## Summary

Create page 6, `Bokeh Shape Simulator`, as a close-up visualization of aperture blades, highlight shape, and blur strength.

## Implementation Status

Implemented first pass in `src/main.ts` and `src/styles.css`: aperture blades, polygonal opening, bokeh highlight field, and page-specific controls/readouts are live.

## Key Changes

- Render an aperture-blade diagram beside a defocused highlight field.
- Reuse f-stop, focal length, focus distance, background distance, and aperture blade count controls.
- Show bokeh circles or polygons that change size and shape with aperture.
- Add clear visual distinction between blur amount and aperture blade shape.

## Test Plan

- Verify `npm run build`.
- Verify `npm run test:run`.
- Verify the sixth top menu button opens `Bokeh Shape Simulator`.
- Verify wide apertures produce larger blur discs.
- Verify stopped-down apertures produce smaller, more polygonal highlights.

## Assumptions

- The first implementation can use simplified blade geometry rather than lens-specific blade counts.
- Bokeh shape is illustrative rather than tied to a specific real lens model.
