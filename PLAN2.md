# Perspective Compression Plan

## Summary

Create page 2, `Perspective Compression`, as a visual comparison of camera distance, focal length, subject size, and background scale. It should explain how perspective changes mainly with camera position while focal length changes framing.

## Implementation Status

Implemented first pass in `src/main.ts` and `src/styles.css`: the page now renders a forward-facing SVG scene with subject scale, background scale, guides, controls, and readouts.

## Key Changes

- Reuse focal length, subject distance, and background distance controls.
- Render a forward-facing scene with subject and background landmarks.
- Show how moving the camera farther back and using longer focal lengths makes the background appear larger relative to the subject.
- Include comparison guides for subject height and background scale.

## Test Plan

- Verify `npm run build`.
- Verify `npm run test:run`.
- Verify the second top menu button opens `Perspective Compression`.
- Verify focal length changes framing.
- Verify subject/background distance changes relative scale.

## Assumptions

- This page should focus on perspective and framing, not depth-of-field blur.
- Existing slider ranges are sufficient for the first version.
