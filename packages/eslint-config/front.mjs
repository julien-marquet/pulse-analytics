import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import base, { eslintBaseRules } from './base.mjs';

export const eslintFrontRules = eslintBaseRules;

export default defineConfig(
  ...base,
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    rules: eslintFrontRules
  },
);