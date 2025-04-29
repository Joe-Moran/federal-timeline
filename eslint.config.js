import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.js'],
  },
  js.configs.recommended,
  {
    rules: {
      'no-console': ['warn'],
      'no-var': ['error'],
      '@/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['export'] },
      ],
    },
  },
])
