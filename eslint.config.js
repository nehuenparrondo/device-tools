// eslint.config.js — Reglas de Expo, TypeScript estricto y formato consistente.
import { createRequire } from 'node:module';
import { fixupConfigRules } from '@eslint/compat';
const require = createRequire(import.meta.url);
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

export default defineConfig([
  ...fixupConfigRules(expoConfig),
  prettierConfig,
  { ignores: ['dist/**', '.expo/**', 'android/**', 'ios/**'] },
  { files: ['**/*.ts', '**/*.tsx'], rules: { '@typescript-eslint/no-explicit-any': 'error' } },
  {
    files: ['src/hooks/**/*.ts', 'src/context/**/*.tsx'],
    // Los efectos sincronizan permisos y hardware externos, y reinician estados al cerrar sesiones.
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
]);
