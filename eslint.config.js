import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'vite.config.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-properties': [
        'error',
        { property: 'innerHTML', message: 'Use createElement + textContent (task requirement).' },
        { property: 'outerHTML', message: 'Use createElement + replaceWith (task requirement).' },
        { property: 'insertAdjacentHTML', message: 'Use createElement + append (task requirement).' },
      ],

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  prettier,
);