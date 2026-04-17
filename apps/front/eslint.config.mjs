// @ts-nocheck
import { defineConfig } from 'eslint/config';
import frontConfig, { eslintFrontRules } from '@app/eslint-config/front';

export default defineConfig(
    ...frontConfig,
  {
    ignores: ['eslint.config.mjs'],
  },
  {
    rules: {
      ...eslintFrontRules,
      "react-hooks/incompatible-library": "off"
    }
  }
);
