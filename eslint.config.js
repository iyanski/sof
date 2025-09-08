const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended, {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_'
            }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',

            // General rules
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
            'no-trailing-spaces': 'error',
            'indent': ['error', 2],
        },
    }, {
        ignores: ['dist/**', 'node_modules/**', '*.js'],
    }
);