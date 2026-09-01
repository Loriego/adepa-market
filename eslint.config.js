import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['public/**'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // This codebase doesn't build with the React Compiler, so the
      // compiler-readiness rule flags the app's standard "fetch on mount"
      // effects (any setState reachable from an effect, even through an
      // awaited async call) as if they were synchronous re-render bugs.
      // Genuine synchronous setState-in-effect (derived state computed
      // directly in the effect body) is still worth catching by hand.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // Context providers here intentionally export their `useX()` hook
    // alongside the provider component, which is the standard React
    // context pattern. It only costs Fast Refresh a full reload of this
    // module on edit; splitting every hook into its own file would touch
    // 25+ consumers for no functional benefit.
    files: ['src/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['public/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.serviceworker, firebase: 'readonly' },
    },
  },
])
