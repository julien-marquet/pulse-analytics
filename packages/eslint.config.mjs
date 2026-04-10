// @ts-nocheck
import { defineConfig } from 'eslint/config';
import nodeConfig from '@app/eslint-config/node';

export default defineConfig(
    {
        ignores: [
            '**/eslint.config.mjs',
            './database/generated/**',
            './eslint-config/**',
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