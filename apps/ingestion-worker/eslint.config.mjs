// @ts-nocheck
import { defineConfig } from 'eslint/config';
import nodeConfig from '@app/eslint-config/node';

export default defineConfig(
  {
    ignores: [
      '**/eslint.config.mjs',
      'webpack.config.js',
      'dist'
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