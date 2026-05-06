// Copyrights © 2026 by Worajedt Sitthidumrong

import type { AppState } from '../core/types';
import type { Language, term } from '../i18n';

export type TermKey = Parameters<typeof term>[1];
export type Translate = (key: TermKey) => string;
export type ReadoutRenderer = (readouts: Array<[string, string]>) => void;
export type TextSetter = (text: SVGTextElement, x: number, y: number, value: string) => void;
export type LineSetter = (line: SVGLineElement, x1: number, y1: number, x2: number, y2: number) => void;

export type PageRenderContext = {
  language: Language;
  renderTopicReadouts: ReadoutRenderer;
  state: AppState;
  t: Translate;
};
