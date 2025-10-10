import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'vue/no-unused-vars': 'warn',
      'vue/singleline-html-element-content-newline': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  eslintConfigPrettier,
])
