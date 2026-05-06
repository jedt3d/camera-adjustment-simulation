# Liveview Simulation Plan

## Summary

Build page 4, `Liveview Simulation`, as a forward-facing camera preview driven by the same toolbar sliders and optical model used by the depth diagram. The page keeps the page 3/4 camera toolbar and readouts, while its stage renders a portrait/liveview composition: model foreground, urban/city background, bokeh highlights, focus box, thirds grid, vignette, and compact camera HUD.

## Implementation Status

Implemented as page 4 with CSS-composed model/city visuals, bokeh highlights, focus box, thirds grid, vignette, compact HUD, and shared optical model behavior.

## Key Changes

- Keep the existing top menu page switcher; Liveview Simulation appears after Depth Diagram.
- Render the Liveview stage as a layered preview:
  - Urban/city background layer.
  - Model foreground layer.
  - Bokeh light layer.
  - Viewfinder overlay with thirds grid, center focus box, and bottom HUD.
- Reuse the existing shared camera state:
  - Focal length changes crop/framing.
  - Sensor preset changes crop factor.
  - F-stop changes blur and bokeh strength.
  - Focus distance determines which layer appears sharp.
  - Subject/background distances control relative blur intensity.

## Rendering Behavior

- Use CSS/SVG-like local layers, not external runtime dependencies.
- Current implementation uses CSS-composed local visuals rather than external bitmap assets.
- Background should crop tighter with longer focal lengths and smaller sensors.
- Model size should change naturally with focal length and sensor crop, matching real framing behavior.
- Background blur increases when the focus distance is closer to the model than the city background, especially at wider apertures.
- Model blur increases when focus distance moves away from subject distance.
- Bokeh circles grow and soften at wider apertures and stronger background defocus.
- HUD displays current focal length, f-stop, focus distance, and sensor preset.

## Test Plan

- Run `npm run build`.
- Run `npm run test:run`.
- Verify top menu switches between both pages.
- Verify `Liveview Simulation` h1 appears on page 4.
- Verify camera-depth toolbar and readouts remain visible on pages 3 and 4.
- Verify all sliders update the Liveview stage without breaking the depth diagram.
- Check visual behavior at:
  - 50mm, f/4, focus 5m, subject 5m, background 15m.
  - f/1.2 versus f/16.
  - Full frame versus APS-C versus Micro Four Thirds.
  - Focus near subject versus focus near/infinity background.

## Assumptions

- Generated or CSS-composed local visuals are acceptable; no external image loading is required.
- Liveview should be photo-like and practical, but it does not need physically perfect optical rendering.
- The existing toolbar and readout data model remains shared between pages 3 and 4.
