// Copyrights © 2026 by Worajedt Sitthidumrong

import './styles.css';

import {
  apertureSteps,
  defaultState,
  focalSteps,
  infinityFocusValue,
  isoSteps,
  sensors,
  shutterSteps,
} from './core/constants';
import { formatFocusDistance, formatShutter } from './core/format';
import { buildModel } from './core/optics';
import type { AppState, OpticalModel, PageKey, SensorKey } from './core/types';
import { label, type Language, pageSummaries, pageTitles, term } from './i18n';
import { renderBokehPage as renderBokehPageModule } from './pages/bokeh';
import { renderDepthGrid, renderDepthPage, type DepthElements } from './pages/depth';
import { renderExposurePage as renderExposurePageModule } from './pages/exposure';
import { renderLensDistortionPage } from './pages/lensDistortion';
import { renderLiveviewPage } from './pages/liveview';
import { renderPerspectivePage as renderPerspectivePageModule } from './pages/perspective';
import { renderSensorCropPage as renderSensorCropPageModule } from './pages/sensorCrop';
import { renderZoneFocusPage as renderZoneFocusPageModule } from './pages/zoneFocus';

const state: AppState = { ...defaultState };

let activePage: PageKey = 'exposure';
let language: Language = 'en';

const nonCameraPages: PageKey[] = ['exposure', 'perspective', 'sensorCrop', 'bokeh', 'zoneFocus', 'lensDistortion'];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found.');
}

app.innerHTML = `
  <main class="shell">
    <nav class="top-menu" aria-label="Diagram views">
      <button class="top-menu__button is-active" type="button" data-page="exposure" aria-current="page">
        Exposure Triangle
      </button>
      <button class="top-menu__button" type="button" data-page="perspective">
        Perspective Compression
      </button>
      <button class="top-menu__button" type="button" data-page="depth">
        Depth Diagram
      </button>
      <button class="top-menu__button" type="button" data-page="liveview">
        Liveview Simulation
      </button>
      <button class="top-menu__button" type="button" data-page="sensorCrop">
        Sensor Crop Comparison
      </button>
      <button class="top-menu__button" type="button" data-page="bokeh">
        Bokeh Shape Simulator
      </button>
      <button class="top-menu__button" type="button" data-page="zoneFocus">
        Focus Plane / Zone Focus
      </button>
      <button class="top-menu__button" type="button" data-page="lensDistortion">
        Lens Distortion
      </button>
      <label class="top-menu__language">
        <span id="languageLabel">Language</span>
        <select id="languageSelect" aria-label="Language">
          <option value="en">EN</option>
          <option value="th">TH</option>
        </select>
      </label>
    </nav>

    <section class="toolbar" aria-label="Camera diagram controls">
      <div class="brand">
        <span id="brandLabel" class="brand__label">Top View</span>
        <h1 id="pageTitle">Exposure Triangle</h1>
        <p id="pageSummary" class="brand__summary">Aperture, shutter speed, ISO, brightness, motion blur, and noise.</p>
      </div>

      <div id="cameraControls" class="control-grid">
        <label class="control control--wide">
          <span class="control__top">
            <span data-term="focalLength">Focal length</span>
            <output id="focalLengthValue">50 mm</output>
          </span>
          <input id="focalLength" type="range" min="0" max="17" step="1" value="10" />
        </label>

        <label class="control">
          <span class="control__top">
            <span data-term="fStop">F-stop</span>
            <output id="apertureValue">f/4.0</output>
          </span>
          <input id="aperture" type="range" min="0" max="22" step="1" value="12" />
        </label>

        <label class="control">
          <span class="control__top">
            <span data-term="focusDistance">Focus distance</span>
            <output id="focusValue">5.0 m</output>
          </span>
          <input id="focusDistance" type="range" min="1.2" max="30.1" step="0.1" value="5" />
        </label>

        <label class="control">
          <span class="control__top">
            <span data-term="subjectDistance">Subject distance</span>
            <output id="subjectValue">5.0 m</output>
          </span>
          <input id="subjectDistance" type="range" min="2" max="15" step="0.1" value="5" />
        </label>

        <label class="control">
          <span class="control__top">
            <span data-term="background">Background</span>
            <output id="backgroundValue">15.0 m</output>
          </span>
          <input id="backgroundDistance" type="range" min="2" max="20" step="0.1" value="15" />
        </label>

        <label class="control">
          <span class="control__top">
            <span data-term="sensor">Sensor</span>
          </span>
          <select id="sensor">
            <option value="full-frame">Full frame</option>
            <option value="aps-c">APS-C</option>
            <option value="mft">Micro Four Thirds</option>
          </select>
        </label>
      </div>
      <div id="topicControls" class="control-grid topic-control-grid is-hidden"></div>
    </section>

    <section id="exposureStage" class="stage topic-stage" aria-label="Exposure triangle">
      <div class="topic-panel exposure-panel">
        <div id="exposurePreview" class="exposure-preview">
          <div class="exposure-sky"></div>
          <div class="exposure-runner">
            <span></span>
          </div>
          <div id="exposureMotionTrail" class="motion-trail"></div>
          <div id="exposureGrain" class="grain-overlay"></div>
        </div>
        <svg id="exposureTriangleSvg" class="topic-svg topic-svg--overlay" viewBox="0 0 640 440" role="img" aria-label="Exposure triangle diagram">
          <polygon class="triangle-face" points="320,58 88,360 552,360"></polygon>
          <g class="triangle-node triangle-node--aperture">
            <circle id="apertureNode" cx="320" cy="58" r="42"></circle>
            <text x="320" y="52">Aperture</text>
            <text id="apertureNodeValue" x="320" y="76">f/4.0</text>
          </g>
          <g class="triangle-node triangle-node--shutter">
            <circle id="shutterNode" cx="88" cy="360" r="42"></circle>
            <text x="88" y="354">Shutter</text>
            <text id="shutterNodeValue" x="88" y="378">1/125</text>
          </g>
          <g class="triangle-node triangle-node--iso">
            <circle id="isoNode" cx="552" cy="360" r="42"></circle>
            <text x="552" y="354">ISO</text>
            <text id="isoNodeValue" x="552" y="378">400</text>
          </g>
          <line id="exposureBalanceLine" class="balance-line" x1="320" y1="220" x2="320" y2="220"></line>
          <text id="exposureCenterValue" class="topic-svg-label topic-svg-label--large" x="320" y="222">EV</text>
          <text class="topic-svg-label" x="320" y="402">Brightness, motion blur, and noise respond together.</text>
        </svg>
      </div>
    </section>

    <section id="perspectiveStage" class="stage topic-stage is-hidden" aria-label="Perspective compression">
      <svg id="perspectiveSvg" class="topic-svg" viewBox="0 0 1280 620" role="img" aria-label="Perspective compression comparison">
        <rect class="topic-bg" x="0" y="0" width="1280" height="620"></rect>
        <g id="perspectiveGrid"></g>
        <g id="perspectiveBackground" class="perspective-background"></g>
        <g id="perspectiveSubject" class="perspective-subject"></g>
        <line class="perspective-guide" x1="165" y1="128" x2="165" y2="520"></line>
        <line id="perspectiveSubjectGuide" class="perspective-guide perspective-guide--accent" x1="0" y1="0" x2="0" y2="0"></line>
        <text id="perspectiveLabel" class="topic-svg-label topic-svg-label--large" x="640" y="70"></text>
        <text id="perspectiveScaleLabel" class="topic-svg-label" x="640" y="554"></text>
      </svg>
    </section>

    <section id="depthStage" class="stage" aria-label="Interactive camera depth diagram">
      <svg id="diagram" viewBox="0 0 1920 620" role="img" aria-labelledby="diagramTitle diagramDesc">
        <title id="diagramTitle">Top-down camera depth-of-field diagram</title>
        <desc id="diagramDesc">A camera, subject, background, focus plane, field of view rays, and depth-of-field limits update as controls change.</desc>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
          <marker id="arrowStart" markerWidth="10" markerHeight="10" refX="2" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 10 0 L 0 5 L 10 10 z"></path>
          </marker>
          <linearGradient id="dofGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stop-color="#2fa7a1" stop-opacity="0.1"></stop>
            <stop offset="48%" stop-color="#2fa7a1" stop-opacity="0.28"></stop>
            <stop offset="52%" stop-color="#2fa7a1" stop-opacity="0.28"></stop>
            <stop offset="100%" stop-color="#2fa7a1" stop-opacity="0.1"></stop>
          </linearGradient>
        </defs>

        <rect class="svg-bg" x="0" y="0" width="1920" height="620"></rect>
        <g id="grid"></g>
        <line id="axis" class="axis" x1="70" y1="308" x2="1860" y2="308"></line>
        <rect id="dofBand" class="dof-band" x="0" y="124" width="0" height="368" rx="0"></rect>

        <g id="fov">
          <polygon id="fovFill" class="fov-fill" points=""></polygon>
          <line id="upperRay" class="fov-ray" x1="0" y1="0" x2="0" y2="0"></line>
          <line id="lowerRay" class="fov-ray" x1="0" y1="0" x2="0" y2="0"></line>
        </g>

        <g id="focusRays">
          <line id="focusCenter" class="focus-ray focus-ray--center" x1="0" y1="0" x2="0" y2="0"></line>
        </g>

        <g id="planes">
          <line id="nearPlane" class="plane plane--limit" x1="0" y1="126" x2="0" y2="490"></line>
          <line id="farPlane" class="plane plane--limit" x1="0" y1="126" x2="0" y2="490"></line>
          <line id="focusPlane" class="plane plane--focus" x1="0" y1="126" x2="0" y2="490"></line>
          <g id="subjectShape" class="subject-shape">
            <ellipse id="subjectHead" cx="0" cy="0" rx="0" ry="0"></ellipse>
            <path id="subjectShoulders" d=""></path>
            <path id="subjectTorso" d=""></path>
          </g>
          <line id="backgroundPlane" class="plane plane--background" x1="0" y1="0" x2="0" y2="0"></line>
        </g>

        <g id="camera" class="camera">
          <path id="cameraBody" class="camera-body" d=""></path>
          <path id="lens" class="camera-lens" d=""></path>
        </g>

        <g id="imageFormation">
          <polyline id="imageRayUpper" class="image-ray" points=""></polyline>
          <polyline id="imageRayLower" class="image-ray" points=""></polyline>
          <line id="sensorPlane" class="sensor-plane" x1="0" y1="0" x2="0" y2="0"></line>
          <line id="lensFrontPlane" class="lens-front-plane" x1="0" y1="0" x2="0" y2="0"></line>
          <circle id="nodalPoint" class="nodal-point" r="6"></circle>
          <line id="sensorToLens" class="measure-line measure-line--internal" x1="0" y1="0" x2="0" y2="0"></line>
          <text id="sensorLabel" class="label label--strong" x="0" y="0">Sensor</text>
          <text id="sensorSizeLabel" class="label" x="0" y="0">36.0 mm</text>
          <text id="focusPointLabel" class="label" x="0" y="0">Optical center</text>
          <text id="sensorToLensLabel" class="label" x="0" y="0"></text>
        </g>

        <g id="measurements">
          <line id="cameraToSubject" class="measure-line" x1="0" y1="542" x2="0" y2="542"></line>
          <line id="subjectToBackground" class="measure-line measure-line--muted" x1="0" y1="574" x2="0" y2="574"></line>
          <text id="cameraToSubjectLabel" class="label" x="0" y="534"></text>
          <text id="subjectToBackgroundLabel" class="label" x="0" y="600"></text>
        </g>

        <g id="labels">
          <text id="cameraLabel" class="label label--strong" x="0" y="0">Camera</text>
          <text id="nearLabel" class="label" x="0" y="0">Near limit</text>
          <text id="focusPlaneLabel" class="label label--strong" x="0" y="0">Focus plane</text>
          <text id="farLabel" class="label" x="0" y="0">Far limit</text>
          <text id="backgroundLabel" class="label label--strong" x="0" y="0">Background</text>
          <text id="fovLabel" class="label" x="0" y="0">Field of view</text>
        </g>
      </svg>
    </section>

    <section id="liveviewStage" class="stage stage--blank is-hidden" aria-label="Liveview simulation">
      <div id="liveviewFrame" class="liveview-frame">
        <div id="liveviewScene" class="liveview-scene">
          <div id="liveviewBackground" class="liveview-background">
            <div class="skyline skyline--far"></div>
            <div class="skyline skyline--near"></div>
            <div class="street"></div>
          </div>
          <div id="liveviewBokeh" class="liveview-bokeh" aria-hidden="true">
            <span style="--x: 12%; --y: 31%; --s: 0.76;"></span>
            <span style="--x: 23%; --y: 24%; --s: 1.08;"></span>
            <span style="--x: 38%; --y: 29%; --s: 0.64;"></span>
            <span style="--x: 54%; --y: 22%; --s: 1.22;"></span>
            <span style="--x: 69%; --y: 34%; --s: 0.92;"></span>
            <span style="--x: 82%; --y: 27%; --s: 1.34;"></span>
            <span style="--x: 18%; --y: 57%; --s: 0.72;"></span>
            <span style="--x: 46%; --y: 61%; --s: 1.15;"></span>
            <span style="--x: 73%; --y: 58%; --s: 0.84;"></span>
          </div>
          <div id="liveviewModel" class="liveview-model">
            <div class="model-hair"></div>
            <div class="model-head"></div>
            <div class="model-neck"></div>
            <div class="model-coat"></div>
            <div class="model-shirt"></div>
          </div>
          <div class="liveview-grid" aria-hidden="true"></div>
          <div id="liveviewFocusBox" class="liveview-focus-box" aria-hidden="true"></div>
          <div class="liveview-vignette" aria-hidden="true"></div>
          <div class="liveview-hud">
            <span>LIVEVIEW</span>
            <span id="liveviewHudReadout">50mm  f/4.0  Focus 5.0 m</span>
          </div>
        </div>
      </div>
    </section>

    <section id="sensorCropStage" class="stage topic-stage is-hidden" aria-label="Sensor crop comparison">
      <div class="crop-layout" id="cropPanels">
        <article class="crop-panel" data-crop-panel="full-frame">
          <div class="crop-scene">
            <div class="crop-city"></div>
            <div class="crop-person"></div>
            <div class="crop-frame-box"></div>
          </div>
          <strong>Full frame</strong>
          <span>36.0 mm sensor width</span>
        </article>
        <article class="crop-panel" data-crop-panel="aps-c">
          <div class="crop-scene">
            <div class="crop-city"></div>
            <div class="crop-person"></div>
            <div class="crop-frame-box"></div>
          </div>
          <strong>APS-C</strong>
          <span>23.5 mm sensor width</span>
        </article>
        <article class="crop-panel" data-crop-panel="mft">
          <div class="crop-scene">
            <div class="crop-city"></div>
            <div class="crop-person"></div>
            <div class="crop-frame-box"></div>
          </div>
          <strong>Micro Four Thirds</strong>
          <span>17.3 mm sensor width</span>
        </article>
      </div>
    </section>

    <section id="bokehStage" class="stage topic-stage is-hidden" aria-label="Bokeh shape simulator">
      <div class="bokeh-layout">
        <svg id="apertureSvg" class="topic-svg bokeh-aperture" viewBox="0 0 520 520" role="img" aria-label="Aperture blade diagram">
          <rect class="topic-bg" x="0" y="0" width="520" height="520"></rect>
          <circle class="aperture-housing" cx="260" cy="260" r="188"></circle>
          <g id="bladeGroup"></g>
          <polygon id="apertureOpening" class="aperture-opening" points=""></polygon>
          <text id="apertureBladeLabel" class="topic-svg-label topic-svg-label--large" x="260" y="470"></text>
        </svg>
        <div id="bokehField" class="bokeh-field">
          <span style="--x: 16%; --y: 26%; --s: 0.82;"></span>
          <span style="--x: 31%; --y: 18%; --s: 1.12;"></span>
          <span style="--x: 48%; --y: 31%; --s: 0.74;"></span>
          <span style="--x: 67%; --y: 22%; --s: 1.28;"></span>
          <span style="--x: 84%; --y: 35%; --s: 0.9;"></span>
          <span style="--x: 24%; --y: 64%; --s: 1.34;"></span>
          <span style="--x: 55%; --y: 71%; --s: 1;"></span>
          <span style="--x: 78%; --y: 61%; --s: 1.52;"></span>
          <div class="bokeh-focus-subject"></div>
        </div>
      </div>
    </section>

    <section id="zoneFocusStage" class="stage topic-stage is-hidden" aria-label="Focus plane and zone focus">
      <svg id="zoneSvg" class="topic-svg" viewBox="0 0 1280 620" role="img" aria-label="Zone focus ground plane">
        <rect class="topic-bg" x="0" y="0" width="1280" height="620"></rect>
        <g id="zoneGrid"></g>
        <rect id="zoneBand" class="zone-band" x="0" y="0" width="0" height="0"></rect>
        <line id="zoneNearLine" class="zone-line" x1="0" y1="0" x2="0" y2="0"></line>
        <line id="zoneFocusLine" class="zone-line zone-line--focus" x1="0" y1="0" x2="0" y2="0"></line>
        <line id="zoneFarLine" class="zone-line" x1="0" y1="0" x2="0" y2="0"></line>
        <g id="zoneSubjectMarker" class="zone-subject-marker"></g>
        <text id="zoneStatusLabel" class="topic-svg-label topic-svg-label--large" x="640" y="84"></text>
        <text id="zoneScaleLabel" class="topic-svg-label" x="640" y="548"></text>
      </svg>
    </section>

    <section id="lensDistortionStage" class="stage topic-stage is-hidden" aria-label="Lens distortion">
      <div class="distortion-layout">
        <svg id="distortionSvg" class="topic-svg" viewBox="0 0 1280 620" role="img" aria-label="Lens distortion visual comparison">
          <rect class="topic-bg" x="0" y="0" width="1280" height="620"></rect>
          <g id="distortionGrid"></g>
          <g id="distortionPortrait" class="distortion-portrait"></g>
          <line class="split-line" x1="640" y1="70" x2="640" y2="550"></line>
          <text class="topic-svg-label topic-svg-label--large" x="320" y="72">Reference</text>
          <text id="distortionLabel" class="topic-svg-label topic-svg-label--large" x="960" y="72">Lens rendering</text>
          <text id="distortionAmountLabel" class="topic-svg-label" x="640" y="586"></text>
        </svg>
      </div>
    </section>

    <section id="cameraReadouts" class="readouts" aria-label="Computed camera values">
      <article class="readout-card">
        <span data-term="focalLength">Focal length</span>
        <strong id="focalReadout">0 mm</strong>
      </article>
      <article class="readout-card">
        <span data-term="focusDistance">Focus distance</span>
        <strong id="focusReadout">0 m</strong>
      </article>
      <article class="readout-card">
        <span data-term="actualDof">Actual DOF</span>
        <strong id="actualDofReadout">0 cm</strong>
      </article>
      <article class="readout-card">
        <span data-term="nearLimit">Near limit</span>
        <strong id="nearReadout">0 m</strong>
      </article>
      <article class="readout-card">
        <span data-term="farLimit">Far limit</span>
        <strong id="farReadout">0 m</strong>
      </article>
      <article class="readout-card">
        <span data-term="hyperfocal">Hyperfocal</span>
        <strong id="hyperfocalReadout">0 m</strong>
      </article>
    </section>

    <section id="plannedReadouts" class="readouts readouts--planned is-hidden" aria-label="Planned page values"></section>

    <footer class="app-footer">
      <span>Copyrights © 2026 by Worajedt Sitthidumrong</span>
      <span>Source code</span>
    </footer>
  </main>
`;

const getInput = (id: string) => {
  const input = document.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`);
  if (!input) {
    throw new Error(`Missing input #${id}.`);
  }
  return input;
};

const els = {
  topMenuButtons: Array.from(document.querySelectorAll<HTMLButtonElement>('.top-menu__button')),
  exposureStage: document.querySelector<HTMLElement>('#exposureStage')!,
  perspectiveStage: document.querySelector<HTMLElement>('#perspectiveStage')!,
  depthStage: document.querySelector<HTMLElement>('#depthStage')!,
  liveviewStage: document.querySelector<HTMLElement>('#liveviewStage')!,
  sensorCropStage: document.querySelector<HTMLElement>('#sensorCropStage')!,
  bokehStage: document.querySelector<HTMLElement>('#bokehStage')!,
  zoneFocusStage: document.querySelector<HTMLElement>('#zoneFocusStage')!,
  lensDistortionStage: document.querySelector<HTMLElement>('#lensDistortionStage')!,
  pageTitle: document.querySelector<HTMLHeadingElement>('#pageTitle')!,
  pageSummary: document.querySelector<HTMLElement>('#pageSummary')!,
  brandLabel: document.querySelector<HTMLElement>('#brandLabel')!,
  languageLabel: document.querySelector<HTMLElement>('#languageLabel')!,
  languageSelect: document.querySelector<HTMLSelectElement>('#languageSelect')!,
  cameraControls: document.querySelector<HTMLElement>('#cameraControls')!,
  topicControls: document.querySelector<HTMLElement>('#topicControls')!,
  cameraReadouts: document.querySelector<HTMLElement>('#cameraReadouts')!,
  plannedReadouts: document.querySelector<HTMLElement>('#plannedReadouts')!,
  exposurePreview: document.querySelector<HTMLElement>('#exposurePreview')!,
  exposureMotionTrail: document.querySelector<HTMLElement>('#exposureMotionTrail')!,
  exposureGrain: document.querySelector<HTMLElement>('#exposureGrain')!,
  exposureBalanceLine: document.querySelector<SVGLineElement>('#exposureBalanceLine')!,
  exposureCenterValue: document.querySelector<SVGTextElement>('#exposureCenterValue')!,
  apertureNodeValue: document.querySelector<SVGTextElement>('#apertureNodeValue')!,
  shutterNodeValue: document.querySelector<SVGTextElement>('#shutterNodeValue')!,
  isoNodeValue: document.querySelector<SVGTextElement>('#isoNodeValue')!,
  perspectiveGrid: document.querySelector<SVGGElement>('#perspectiveGrid')!,
  perspectiveBackground: document.querySelector<SVGGElement>('#perspectiveBackground')!,
  perspectiveSubject: document.querySelector<SVGGElement>('#perspectiveSubject')!,
  perspectiveSubjectGuide: document.querySelector<SVGLineElement>('#perspectiveSubjectGuide')!,
  perspectiveLabel: document.querySelector<SVGTextElement>('#perspectiveLabel')!,
  perspectiveScaleLabel: document.querySelector<SVGTextElement>('#perspectiveScaleLabel')!,
  cropPanels: Array.from(document.querySelectorAll<HTMLElement>('[data-crop-panel]')),
  bladeGroup: document.querySelector<SVGGElement>('#bladeGroup')!,
  apertureOpening: document.querySelector<SVGPolygonElement>('#apertureOpening')!,
  apertureBladeLabel: document.querySelector<SVGTextElement>('#apertureBladeLabel')!,
  bokehField: document.querySelector<HTMLElement>('#bokehField')!,
  zoneGrid: document.querySelector<SVGGElement>('#zoneGrid')!,
  zoneBand: document.querySelector<SVGRectElement>('#zoneBand')!,
  zoneNearLine: document.querySelector<SVGLineElement>('#zoneNearLine')!,
  zoneFocusLine: document.querySelector<SVGLineElement>('#zoneFocusLine')!,
  zoneFarLine: document.querySelector<SVGLineElement>('#zoneFarLine')!,
  zoneSubjectMarker: document.querySelector<SVGGElement>('#zoneSubjectMarker')!,
  zoneStatusLabel: document.querySelector<SVGTextElement>('#zoneStatusLabel')!,
  zoneScaleLabel: document.querySelector<SVGTextElement>('#zoneScaleLabel')!,
  distortionGrid: document.querySelector<SVGGElement>('#distortionGrid')!,
  distortionPortrait: document.querySelector<SVGGElement>('#distortionPortrait')!,
  distortionLabel: document.querySelector<SVGTextElement>('#distortionLabel')!,
  distortionAmountLabel: document.querySelector<SVGTextElement>('#distortionAmountLabel')!,
  liveviewFrame: document.querySelector<HTMLElement>('#liveviewFrame')!,
  liveviewBackground: document.querySelector<HTMLElement>('#liveviewBackground')!,
  liveviewBokeh: document.querySelector<HTMLElement>('#liveviewBokeh')!,
  liveviewModel: document.querySelector<HTMLElement>('#liveviewModel')!,
  liveviewFocusBox: document.querySelector<HTMLElement>('#liveviewFocusBox')!,
  liveviewHudReadout: document.querySelector<HTMLElement>('#liveviewHudReadout')!,
  aperture: getInput('aperture') as HTMLInputElement,
  focusDistance: getInput('focusDistance') as HTMLInputElement,
  subjectDistance: getInput('subjectDistance') as HTMLInputElement,
  backgroundDistance: getInput('backgroundDistance') as HTMLInputElement,
  focalLength: getInput('focalLength') as HTMLInputElement,
  sensor: getInput('sensor') as HTMLSelectElement,
  apertureValue: document.querySelector<HTMLOutputElement>('#apertureValue')!,
  focusValue: document.querySelector<HTMLOutputElement>('#focusValue')!,
  subjectValue: document.querySelector<HTMLOutputElement>('#subjectValue')!,
  backgroundValue: document.querySelector<HTMLOutputElement>('#backgroundValue')!,
  focalLengthValue: document.querySelector<HTMLOutputElement>('#focalLengthValue')!,
  focalReadout: document.querySelector<HTMLElement>('#focalReadout')!,
  focusReadout: document.querySelector<HTMLElement>('#focusReadout')!,
  actualDofReadout: document.querySelector<HTMLElement>('#actualDofReadout')!,
  nearReadout: document.querySelector<HTMLElement>('#nearReadout')!,
  farReadout: document.querySelector<HTMLElement>('#farReadout')!,
  hyperfocalReadout: document.querySelector<HTMLElement>('#hyperfocalReadout')!,
  grid: document.querySelector<SVGGElement>('#grid')!,
  dofBand: document.querySelector<SVGRectElement>('#dofBand')!,
  fovFill: document.querySelector<SVGPolygonElement>('#fovFill')!,
  upperRay: document.querySelector<SVGLineElement>('#upperRay')!,
  lowerRay: document.querySelector<SVGLineElement>('#lowerRay')!,
  focusCenter: document.querySelector<SVGLineElement>('#focusCenter')!,
  nearPlane: document.querySelector<SVGLineElement>('#nearPlane')!,
  farPlane: document.querySelector<SVGLineElement>('#farPlane')!,
  focusPlane: document.querySelector<SVGLineElement>('#focusPlane')!,
  subjectHead: document.querySelector<SVGEllipseElement>('#subjectHead')!,
  subjectShoulders: document.querySelector<SVGPathElement>('#subjectShoulders')!,
  subjectTorso: document.querySelector<SVGPathElement>('#subjectTorso')!,
  backgroundPlane: document.querySelector<SVGLineElement>('#backgroundPlane')!,
  cameraBody: document.querySelector<SVGPathElement>('#cameraBody')!,
  lens: document.querySelector<SVGPathElement>('#lens')!,
  imageRayUpper: document.querySelector<SVGPolylineElement>('#imageRayUpper')!,
  imageRayLower: document.querySelector<SVGPolylineElement>('#imageRayLower')!,
  sensorPlane: document.querySelector<SVGLineElement>('#sensorPlane')!,
  lensFrontPlane: document.querySelector<SVGLineElement>('#lensFrontPlane')!,
  nodalPoint: document.querySelector<SVGCircleElement>('#nodalPoint')!,
  sensorToLens: document.querySelector<SVGLineElement>('#sensorToLens')!,
  sensorLabel: document.querySelector<SVGTextElement>('#sensorLabel')!,
  sensorSizeLabel: document.querySelector<SVGTextElement>('#sensorSizeLabel')!,
  focusPointLabel: document.querySelector<SVGTextElement>('#focusPointLabel')!,
  sensorToLensLabel: document.querySelector<SVGTextElement>('#sensorToLensLabel')!,
  cameraToSubject: document.querySelector<SVGLineElement>('#cameraToSubject')!,
  subjectToBackground: document.querySelector<SVGLineElement>('#subjectToBackground')!,
  cameraToSubjectLabel: document.querySelector<SVGTextElement>('#cameraToSubjectLabel')!,
  subjectToBackgroundLabel: document.querySelector<SVGTextElement>('#subjectToBackgroundLabel')!,
  cameraLabel: document.querySelector<SVGTextElement>('#cameraLabel')!,
  nearLabel: document.querySelector<SVGTextElement>('#nearLabel')!,
  focusPlaneLabel: document.querySelector<SVGTextElement>('#focusPlaneLabel')!,
  farLabel: document.querySelector<SVGTextElement>('#farLabel')!,
  backgroundLabel: document.querySelector<SVGTextElement>('#backgroundLabel')!,
  fovLabel: document.querySelector<SVGTextElement>('#fovLabel')!,
};

function setLine(line: SVGLineElement, x1: number, y1: number, x2: number, y2: number) {
  line.setAttribute('x1', x1.toFixed(2));
  line.setAttribute('y1', y1.toFixed(2));
  line.setAttribute('x2', x2.toFixed(2));
  line.setAttribute('y2', y2.toFixed(2));
}

function setText(text: SVGTextElement, x: number, y: number, value: string) {
  text.setAttribute('x', x.toFixed(2));
  text.setAttribute('y', y.toFixed(2));
  text.textContent = value;
}

const depthElements: DepthElements = {
  actualDofReadout: els.actualDofReadout,
  apertureValue: els.apertureValue,
  backgroundLabel: els.backgroundLabel,
  backgroundPlane: els.backgroundPlane,
  backgroundValue: els.backgroundValue,
  cameraBody: els.cameraBody,
  cameraLabel: els.cameraLabel,
  cameraToSubject: els.cameraToSubject,
  cameraToSubjectLabel: els.cameraToSubjectLabel,
  dofBand: els.dofBand,
  farLabel: els.farLabel,
  farPlane: els.farPlane,
  farReadout: els.farReadout,
  focusCenter: els.focusCenter,
  focalLengthValue: els.focalLengthValue,
  focalReadout: els.focalReadout,
  focusPlane: els.focusPlane,
  focusPlaneLabel: els.focusPlaneLabel,
  focusPointLabel: els.focusPointLabel,
  focusReadout: els.focusReadout,
  focusValue: els.focusValue,
  fovFill: els.fovFill,
  fovLabel: els.fovLabel,
  grid: els.grid,
  hyperfocalReadout: els.hyperfocalReadout,
  imageRayLower: els.imageRayLower,
  imageRayUpper: els.imageRayUpper,
  lens: els.lens,
  lensFrontPlane: els.lensFrontPlane,
  lowerRay: els.lowerRay,
  nearLabel: els.nearLabel,
  nearPlane: els.nearPlane,
  nearReadout: els.nearReadout,
  nodalPoint: els.nodalPoint,
  sensorLabel: els.sensorLabel,
  sensorPlane: els.sensorPlane,
  sensorSizeLabel: els.sensorSizeLabel,
  sensorToLens: els.sensorToLens,
  sensorToLensLabel: els.sensorToLensLabel,
  subjectDistanceValue: els.subjectValue,
  subjectHead: els.subjectHead,
  subjectShoulders: els.subjectShoulders,
  subjectToBackground: els.subjectToBackground,
  subjectToBackgroundLabel: els.subjectToBackgroundLabel,
  subjectTorso: els.subjectTorso,
  upperRay: els.upperRay,
};

function focalIndex(value: number) {
  return focalSteps.indexOf(value).toString();
}

function apertureIndex(value: number) {
  return Math.max(
    0,
    apertureSteps.findIndex((step) => step === value),
  ).toString();
}

function shutterIndex(value: number) {
  return Math.max(
    0,
    shutterSteps.findIndex((step) => step === value),
  ).toString();
}

function isoIndex(value: number) {
  return Math.max(
    0,
    isoSteps.findIndex((step) => step === value),
  ).toString();
}

function syncCameraControlsFromState() {
  els.focalLength.value = focalIndex(state.focalLengthMm);
  els.aperture.value = apertureIndex(state.aperture);
  els.focusDistance.value = Number.isFinite(state.focusDistanceM)
    ? state.focusDistanceM.toFixed(1)
    : infinityFocusValue.toString();
  els.subjectDistance.value = state.subjectDistanceM.toFixed(1);
  els.backgroundDistance.value = state.backgroundDistanceM.toFixed(1);
  els.sensor.value = state.sensor;
}

function makeRangeControl(
  label: string,
  control: string,
  min: number,
  max: number,
  step: number,
  value: number,
  output: string,
  wide = false,
) {
  return `
    <label class="control${wide ? ' control--wide' : ''}">
      <span class="control__top">
        <span>${label}</span>
        <output>${output}</output>
      </span>
      <input data-topic-control="${control}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" />
    </label>
  `;
}

function t(key: Parameters<typeof term>[1]) {
  return term(language, key);
}

function makeSelectControl(label: string, control: string, options: Array<[string, string]>, value: string) {
  return `
    <label class="control">
      <span class="control__top">
        <span>${label}</span>
      </span>
      <select data-topic-control="${control}">
        ${options.map(([optionValue, optionLabel]) => `<option value="${optionValue}"${optionValue === value ? ' selected' : ''}>${optionLabel}</option>`).join('')}
      </select>
    </label>
  `;
}

function renderTopicControls() {
  if (!nonCameraPages.includes(activePage)) {
    els.topicControls.innerHTML = '';
    return;
  }

  const commonFocal = makeRangeControl(
    t('focalLength'),
    'focalLength',
    0,
    focalSteps.length - 1,
    1,
    Number(focalIndex(state.focalLengthMm)),
    `${state.focalLengthMm} mm`,
    true,
  );
  const commonAperture = makeRangeControl(
    t('fStop'),
    'aperture',
    0,
    apertureSteps.length - 1,
    1,
    Number(apertureIndex(state.aperture)),
    `f/${state.aperture.toFixed(1)}`,
  );
  const focus = makeRangeControl(
    t('focusDistance'),
    'focusDistance',
    1.2,
    infinityFocusValue,
    0.1,
    Number.isFinite(state.focusDistanceM) ? state.focusDistanceM : infinityFocusValue,
    formatFocusDistance(state.focusDistanceM),
  );
  const subject = makeRangeControl(
    t('subjectDistance'),
    'subjectDistance',
    2,
    15,
    0.1,
    state.subjectDistanceM,
    `${state.subjectDistanceM.toFixed(1)} m`,
  );
  const background = makeRangeControl(
    t('background'),
    'backgroundDistance',
    2,
    20,
    0.1,
    state.backgroundDistanceM,
    `${state.backgroundDistanceM.toFixed(1)} m`,
  );
  const sensor = makeSelectControl(
    t('sensor'),
    'sensor',
    Object.entries(sensors).map(([key, preset]) => [key, preset.label]),
    state.sensor,
  );

  const controls: Record<Exclude<PageKey, 'depth' | 'liveview'>, string[]> = {
    exposure: [
      commonAperture,
      makeRangeControl(
        t('shutterSpeed'),
        'shutterSpeed',
        0,
        shutterSteps.length - 1,
        1,
        Number(shutterIndex(state.shutterSpeedS)),
        formatShutter(state.shutterSpeedS),
        true,
      ),
      makeRangeControl(t('iso'), 'iso', 0, isoSteps.length - 1, 1, Number(isoIndex(state.iso)), state.iso.toString()),
    ],
    perspective: [commonFocal, subject, background],
    sensorCrop: [commonFocal, subject, background],
    bokeh: [
      commonFocal,
      commonAperture,
      focus,
      background,
      makeRangeControl(t('apertureBlades'), 'bokehBlades', 5, 11, 1, state.bokehBlades, `${state.bokehBlades}`),
    ],
    zoneFocus: [commonFocal, commonAperture, focus, subject, sensor],
    lensDistortion: [commonFocal, subject],
  };

  els.topicControls.innerHTML = controls[activePage as Exclude<PageKey, 'depth' | 'liveview'>].join('');
  updateTopicControlOutputs();
}

function updateTopicControlOutputs() {
  const controls = Array.from(
    els.topicControls.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-topic-control]'),
  );

  for (const controlEl of controls) {
    const output = controlEl.closest('.control')?.querySelector('output');
    let label = '';

    switch (controlEl.dataset.topicControl) {
      case 'focalLength':
        controlEl.value = focalIndex(state.focalLengthMm);
        label = `${state.focalLengthMm} mm`;
        break;
      case 'aperture':
        controlEl.value = apertureIndex(state.aperture);
        label = `f/${state.aperture.toFixed(1)}`;
        break;
      case 'focusDistance':
        controlEl.value = Number.isFinite(state.focusDistanceM)
          ? state.focusDistanceM.toFixed(1)
          : infinityFocusValue.toString();
        label = formatFocusDistance(state.focusDistanceM);
        break;
      case 'subjectDistance':
        controlEl.value = state.subjectDistanceM.toFixed(1);
        label = `${state.subjectDistanceM.toFixed(1)} m`;
        break;
      case 'backgroundDistance':
        controlEl.value = state.backgroundDistanceM.toFixed(1);
        label = `${state.backgroundDistanceM.toFixed(1)} m`;
        break;
      case 'sensor':
        controlEl.value = state.sensor;
        break;
      case 'shutterSpeed':
        controlEl.value = shutterIndex(state.shutterSpeedS);
        label = formatShutter(state.shutterSpeedS);
        break;
      case 'iso':
        controlEl.value = isoIndex(state.iso);
        label = state.iso.toString();
        break;
      case 'bokehBlades':
        controlEl.value = state.bokehBlades.toString();
        label = state.bokehBlades.toString();
        break;
    }

    if (output) {
      output.textContent = label;
    }
  }
}

function updateStateFromTopicControl(target: HTMLInputElement | HTMLSelectElement) {
  const control = target.dataset.topicControl;

  if (!control) {
    return;
  }

  switch (control) {
    case 'focalLength':
      state.focalLengthMm = focalSteps[Number(target.value)];
      break;
    case 'aperture':
      state.aperture = apertureSteps[Number(target.value)];
      break;
    case 'focusDistance': {
      const requestedFocusDistanceM = Number(target.value);
      state.focusDistanceM =
        requestedFocusDistanceM >= infinityFocusValue ? Number.POSITIVE_INFINITY : requestedFocusDistanceM;
      break;
    }
    case 'subjectDistance':
      state.subjectDistanceM = Number(target.value);
      state.backgroundDistanceM = Math.max(state.backgroundDistanceM, state.subjectDistanceM + 0.5);
      break;
    case 'backgroundDistance':
      state.backgroundDistanceM = Math.max(Number(target.value), state.subjectDistanceM + 0.5);
      break;
    case 'sensor':
      state.sensor = target.value as SensorKey;
      break;
    case 'shutterSpeed':
      state.shutterSpeedS = shutterSteps[Number(target.value)];
      break;
    case 'iso':
      state.iso = isoSteps[Number(target.value)];
      break;
    case 'bokehBlades':
      state.bokehBlades = Number(target.value);
      break;
  }

  syncCameraControlsFromState();
}

function renderLiveview(model: OpticalModel) {
  renderLiveviewPage(
    {
      liveviewBackground: els.liveviewBackground,
      liveviewBokeh: els.liveviewBokeh,
      liveviewFocusBox: els.liveviewFocusBox,
      liveviewFrame: els.liveviewFrame,
      liveviewHudReadout: els.liveviewHudReadout,
      liveviewModel: els.liveviewModel,
    },
    model,
    state,
  );
}

function renderTopicReadouts(readouts: Array<[string, string]>) {
  els.plannedReadouts.innerHTML = readouts
    .map(([label, value]) => `<article class="readout-card"><span>${label}</span><strong>${value}</strong></article>`)
    .join('');
}

function renderExposurePage() {
  renderExposurePageModule(
    {
      apertureNodeValue: els.apertureNodeValue,
      exposureBalanceLine: els.exposureBalanceLine,
      exposureCenterValue: els.exposureCenterValue,
      exposureGrain: els.exposureGrain,
      exposureMotionTrail: els.exposureMotionTrail,
      exposurePreview: els.exposurePreview,
      isoNodeValue: els.isoNodeValue,
      shutterNodeValue: els.shutterNodeValue,
    },
    { language, renderTopicReadouts, state, t },
    { setLine, setText },
  );
}

function renderPerspectivePage() {
  renderPerspectivePageModule(
    {
      perspectiveBackground: els.perspectiveBackground,
      perspectiveGrid: els.perspectiveGrid,
      perspectiveLabel: els.perspectiveLabel,
      perspectiveScaleLabel: els.perspectiveScaleLabel,
      perspectiveSubject: els.perspectiveSubject,
      perspectiveSubjectGuide: els.perspectiveSubjectGuide,
    },
    { language, renderTopicReadouts, state, t },
    { setLine, setText },
  );
}

function renderSensorCropPage() {
  renderSensorCropPageModule({ cropPanels: els.cropPanels }, { language, renderTopicReadouts, state, t });
}

function renderBokehPage(model: OpticalModel) {
  renderBokehPageModule(
    {
      apertureBladeLabel: els.apertureBladeLabel,
      apertureOpening: els.apertureOpening,
      bladeGroup: els.bladeGroup,
      bokehField: els.bokehField,
    },
    { language, renderTopicReadouts, state, t },
    model,
    { setText },
  );
}

function renderZoneFocusPage(model: OpticalModel) {
  renderZoneFocusPageModule(
    {
      zoneBand: els.zoneBand,
      zoneFarLine: els.zoneFarLine,
      zoneFocusLine: els.zoneFocusLine,
      zoneGrid: els.zoneGrid,
      zoneNearLine: els.zoneNearLine,
      zoneScaleLabel: els.zoneScaleLabel,
      zoneStatusLabel: els.zoneStatusLabel,
      zoneSubjectMarker: els.zoneSubjectMarker,
    },
    { language, renderTopicReadouts, state, t },
    model,
    { setLine, setText },
  );
}

function renderDistortionPage() {
  renderLensDistortionPage(
    {
      distortionAmountLabel: els.distortionAmountLabel,
      distortionGrid: els.distortionGrid,
      distortionLabel: els.distortionLabel,
      distortionPortrait: els.distortionPortrait,
    },
    { language, renderTopicReadouts, state, t },
    { setText },
  );
}

function renderTopicPages(model: OpticalModel) {
  renderExposurePage();
  renderPerspectivePage();
  renderSensorCropPage();
  renderBokehPage(model);
  renderZoneFocusPage(model);
  renderDistortionPage();
}

function applyLanguage() {
  els.brandLabel.textContent = activePage === 'depth' ? label(language, 'topView') : '';
  els.brandLabel.classList.toggle('is-hidden', activePage !== 'depth');
  els.languageLabel.textContent = label(language, 'language');
  els.pageTitle.textContent = pageTitles[language][activePage];
  els.pageSummary.textContent = pageSummaries[language][activePage];

  for (const element of Array.from(document.querySelectorAll<HTMLElement>('[data-term]'))) {
    const key = element.dataset.term as Parameters<typeof term>[1] | undefined;
    if (key) {
      element.textContent = term(language, key);
    }
  }

  for (const button of els.topMenuButtons) {
    const page = button.dataset.page as PageKey | undefined;
    if (page) {
      button.textContent = pageTitles[language][page];
    }
  }
}

function syncStateFromControls() {
  state.aperture = apertureSteps[Number(els.aperture.value)];
  const requestedFocusDistanceM = Number(els.focusDistance.value);
  state.focusDistanceM =
    requestedFocusDistanceM >= infinityFocusValue ? Number.POSITIVE_INFINITY : requestedFocusDistanceM;
  state.subjectDistanceM = Number(els.subjectDistance.value);
  state.backgroundDistanceM = Math.max(Number(els.backgroundDistance.value), state.subjectDistanceM + 0.5);
  state.focalLengthMm = focalSteps[Number(els.focalLength.value)];
  state.sensor = els.sensor.value as SensorKey;

  if (Number(els.backgroundDistance.value) !== state.backgroundDistanceM) {
    els.backgroundDistance.value = state.backgroundDistanceM.toFixed(1);
  }
}

function update(syncCamera = activePage === 'depth' || activePage === 'liveview') {
  if (syncCamera) {
    syncStateFromControls();
  }
  const model = buildModel(state);
  renderDepthPage(depthElements, model, state, { setLine, setText, t });
  renderLiveview(model);
  renderTopicPages(model);
  updateTopicControlOutputs();
}

function setActivePage(page: PageKey) {
  activePage = page;
  const stages: Record<PageKey, HTMLElement> = {
    exposure: els.exposureStage,
    perspective: els.perspectiveStage,
    depth: els.depthStage,
    liveview: els.liveviewStage,
    sensorCrop: els.sensorCropStage,
    bokeh: els.bokehStage,
    zoneFocus: els.zoneFocusStage,
    lensDistortion: els.lensDistortionStage,
  };

  for (const [stagePage, stage] of Object.entries(stages) as Array<[PageKey, HTMLElement]>) {
    stage.classList.toggle('is-hidden', activePage !== stagePage);
  }

  applyLanguage();

  const usesCameraInfo = activePage === 'depth' || activePage === 'liveview';
  els.cameraControls.classList.toggle('is-hidden', !usesCameraInfo);
  els.topicControls.classList.toggle('is-hidden', usesCameraInfo);
  els.cameraReadouts.classList.toggle('is-hidden', !usesCameraInfo);
  els.plannedReadouts.classList.toggle('is-hidden', usesCameraInfo);

  if (usesCameraInfo) {
    syncCameraControlsFromState();
  }

  renderTopicControls();

  for (const button of els.topMenuButtons) {
    const isActive = button.dataset.page === activePage;
    button.classList.toggle('is-active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  }
}

for (const input of [
  els.focalLength,
  els.aperture,
  els.focusDistance,
  els.subjectDistance,
  els.backgroundDistance,
  els.sensor,
]) {
  input.addEventListener('input', () => update(true));
  input.addEventListener('change', () => update(true));
}

els.topicControls.addEventListener('input', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
    updateStateFromTopicControl(target);
    update(false);
  }
});

els.topicControls.addEventListener('change', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
    updateStateFromTopicControl(target);
    update(false);
  }
});

for (const button of els.topMenuButtons) {
  button.addEventListener('click', () => {
    const page = button.dataset.page;
    if (page && page in pageTitles.en) {
      setActivePage(page as PageKey);
      update(activePage === 'depth' || activePage === 'liveview');
    }
  });
}

els.languageSelect.addEventListener('change', () => {
  language = els.languageSelect.value as Language;
  applyLanguage();
  renderTopicControls();
  update(false);
});

renderDepthGrid(depthElements);
setActivePage(activePage);
update();
