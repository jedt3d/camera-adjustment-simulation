# Lens Distortion Plan

## Summary

Create page 8, `Lens Distortion`, as a visual demonstration of wide-angle distortion, telephoto flattening, and portrait/grid effects.

## Implementation Status

Implemented first pass in `src/main.ts` and `src/styles.css`: the page now renders reference and warped grid/portrait views driven by focal length and subject distance controls.

## Key Changes

- Render a portrait/model and reference grid.
- Reuse focal length for field-of-view and distortion intensity.
- Show stronger barrel-like distortion at wide focal lengths and flatter rendering at telephoto focal lengths.
- Include an optional before/after or split-view comparison.

## Test Plan

- Verify `npm run build`.
- Verify `npm run test:run`.
- Verify the eighth top menu button opens `Lens Distortion`.
- Verify wide focal lengths visibly distort the grid/portrait more than longer focal lengths.
- Verify telephoto focal lengths look flatter and more compressed.

## Assumptions

- Distortion is illustrative and should not claim to model a specific lens profile.
- The page should remain visual and intuitive, not a calibration tool.
