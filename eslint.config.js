// Copyrights © 2026 by Worajedt Sitthidumrong

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLSelectElement: 'readonly',
        SVGCircleElement: 'readonly',
        SVGEllipseElement: 'readonly',
        SVGGElement: 'readonly',
        SVGLineElement: 'readonly',
        SVGPathElement: 'readonly',
        SVGPolygonElement: 'readonly',
        SVGPolylineElement: 'readonly',
        SVGRectElement: 'readonly',
        SVGTextElement: 'readonly',
      },
    },
    rules: {
      complexity: ['error', { max: 18 }],
      'max-depth': ['error', 4],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
