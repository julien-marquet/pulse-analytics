// @ts-nocheck
import { defineConfig } from 'eslint/config';
import nodeConfig from '@app/eslint-config/node';

export default defineConfig(
  {
    ignores: [
      '**/eslint.config.mjs',
    ],
  },
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);