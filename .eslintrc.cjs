// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/strict',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'svelte/block-lang': [
			'error',
			{
				script: 'ts',
				style: 'scss'
			}
		],
		'svelte/no-target-blank': 'error',
		'svelte/shorthand-attribute': 'error',
		'svelte/shorthand-directive': 'error',
		'svelte/sort-attributes': 'error',
		'svelte/spaced-html-comment': 'error',
		'svelte/no-at-debug-tags': 'error',
		'svelte/mustache-spacing': 'error',
		'svelte/html-self-closing': 'error',
		'svelte/no-useless-mustaches': 'error',
		'no-alert': 'error',
		'no-template-curly-in-string': 'error',
		'require-atomic-updates': 'error',
		'capitalized-comments': 'error',
		'require-await': 'error',
		'no-constant-binary-expression': 'error',
		'no-new-native-nonconstructor': 'error',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error'
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			rules: {
				'no-console': 'error'
			}
		}
	]
});
