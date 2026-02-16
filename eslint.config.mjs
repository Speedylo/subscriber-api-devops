import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			}
		},
		rules: {
			indent: ['error', 'tab'],
			semi: ['error', 'always'],
			quotes: ['error', 'single'],

			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'consistent-return': 'error',
			eqeqeq: ['error', 'always'],

			'no-console': 'off',
			'no-var': 'error',
			'prefer-const': 'error'
		}
	},

	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'commonjs'
		}
	}
]);
