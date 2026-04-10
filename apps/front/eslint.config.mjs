// @ts-nocheck
import { defineConfig } from 'eslint/config';
import frontConfig from '@app/eslint-config/front';

export default defineConfig(
  {
    ignores: ['eslint.config.mjs'],
  },
  ...frontConfig,
);
