// Copyrights © 2026 by Worajedt Sitthidumrong

import { clamp, formatFocusDistance } from '../core/format';
import { getCropFactor, getDefocusAmount } from '../core/optics';
import type { AppState, OpticalModel } from '../core/types';

type LiveviewElements = {
  liveviewBackground: HTMLElement;
  liveviewBokeh: HTMLElement;
  liveviewFocusBox: HTMLElement;
  liveviewFrame: HTMLElement;
  liveviewHudReadout: HTMLElement;
  liveviewModel: HTMLElement;
};

export function renderLiveviewPage(elements: LiveviewElements, model: OpticalModel, state: AppState) {
  const cropFactor = getCropFactor(model.sensor);
  const framingScale = clamp((model.focalLengthMm / 50) * cropFactor, 0.45, 4.2);
  const modelScale = clamp(framingScale * (5 / model.subjectDistanceM), 0.34, 3.4);
  const apertureStrength = clamp((16 / model.aperture - 1) / (16 / 1.2 - 1), 0.02, 1);
  const backgroundDefocus = getDefocusAmount(model.backgroundDistanceM, model);
  const subjectDefocus = getDefocusAmount(model.subjectDistanceM, model);
  const backgroundBlur = clamp(backgroundDefocus * apertureStrength * 18, 0, 18);
  const subjectBlur = clamp(subjectDefocus * apertureStrength * 10, 0, 10);
  const bokehSize = clamp(10 + backgroundBlur * 2.5 + (16 / model.aperture) * 3, 10, 72);
  const backgroundScale = clamp(1 + (framingScale - 1) * 0.38, 0.9, 2.8);
  const backgroundShift = clamp((framingScale - 1) * -4, -18, 8);
  const focusBoxScale = clamp(0.9 / modelScale, 0.48, 1.15);

  elements.liveviewBackground.style.setProperty('--liveview-bg-scale', backgroundScale.toFixed(3));
  elements.liveviewBackground.style.setProperty('--liveview-bg-x', `${backgroundShift.toFixed(2)}%`);
  elements.liveviewBackground.style.filter = `blur(${backgroundBlur.toFixed(2)}px)`;
  elements.liveviewModel.style.setProperty('--liveview-model-scale', modelScale.toFixed(3));
  elements.liveviewModel.style.filter = `blur(${subjectBlur.toFixed(2)}px)`;
  elements.liveviewBokeh.style.setProperty('--bokeh-size', `${bokehSize.toFixed(1)}px`);
  elements.liveviewBokeh.style.opacity = `${clamp(0.18 + backgroundDefocus * apertureStrength * 0.82, 0.18, 0.92)}`;
  elements.liveviewFocusBox.style.transform = `translate(-50%, -50%) scale(${focusBoxScale.toFixed(3)})`;
  elements.liveviewFrame.dataset.focusState =
    subjectDefocus < 0.18 ? 'subject' : backgroundDefocus < 0.18 ? 'background' : 'transition';
  elements.liveviewHudReadout.textContent = `${model.focalLengthMm.toFixed(0)}mm  f/${state.aperture.toFixed(1)}  Focus ${formatFocusDistance(model.focusDistanceM)}  ${model.sensor.label}`;
}
