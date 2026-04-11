import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

export const eslintBaseRules = {
  'prettier/prettier': ['error', { endOfLine: 'lf', singleQuote: true, tabWidth: 2 }],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    },
  ],
}


export default defineConfig(
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: eslintBaseRules
  },
);