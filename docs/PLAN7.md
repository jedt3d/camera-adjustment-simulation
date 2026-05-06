# Focus Plane / Zone Focus Plan

## Summary

Create page 7, `Focus Plane / Zone Focus`, as a zone-focus and hyperfocal-distance teaching view for street-style focusing.

## Implementation Status

Implemented first pass in `src/main.ts` and `src/styles.css`: the page now renders a 0m-20m ground plane with near/focus/far zone markers, subject status, and DOF readouts.

## Key Changes

- Reuse f-stop, focal length, focus distance, subject distance, and sensor preset.
- Render a ground-plane or street-depth view with near/far acceptable sharpness zones.
- Highlight hyperfocal distance when the far limit reaches infinity.
- Show whether the subject falls inside or outside the acceptable sharpness zone.

## Test Plan

- Verify `npm run build`.
- Verify `npm run test:run`.
- Verify the seventh top menu button opens `Focus Plane / Zone Focus`.
- Verify stopping down increases the zone.
- Verify focusing near hyperfocal pushes the far limit to infinity.

## Assumptions

- The existing DOF formulas are the source of truth for near/far/hyperfocal values.
- This page should be more technical than Liveview but simpler than the full depth diagram.
