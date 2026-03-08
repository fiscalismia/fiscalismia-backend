module.exports = {
  root: true,
  env: { browser: true, es6: true, node: true },
  ignorePatterns: ['**/dist/**', 'build/'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['jest.config.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended', // Disables conflicting ESLint rules with TypeScript
        'plugin:@typescript-eslint/recommended', // TypeScript-specific recommended rules
        'prettier' // Disables conflicting rules handled by Prettier code formatting
      ],
      globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly', module: true },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: false }, // no jsx in backend
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      plugins: ['@typescript-eslint', 'jsdoc'], // eslint-plugin-react
      rules: {
        quotes: ['error', 'single'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all', // Check all function arguments
            argsIgnorePattern: '^_', // Ignore arguments that start with an underscore
            caughtErrors: 'all', // Check all caught error variables
            caughtErrorsIgnorePattern: '^_', // Ignore caught error variables that start with an underscore
            destructuredArrayIgnorePattern: '^_', // Ignore array destructured variables that start with an underscore
            varsIgnorePattern: '^_', // Ignore variables that start with an underscore
            ignoreRestSiblings: true // Ignore the rest siblings (e.g., in object destructuring, the variables after the rest element)
          }
        ],
        'no-console': 'error',
        'jsdoc/check-alignment': 'error', // Enforces JSDoc comments are aligned
        'jsdoc/check-param-names': 'error', // Enforces parameter names in JSDoc match those in the function
        'jsdoc/check-types': 'error', // Enforces types in JSDoc comments
        'jsdoc/require-param': 'error', // Require JSDoc for function parameters
        'jsdoc/require-returns': 'error', // Require JSDoc for function return types
        'jsdoc/require-jsdoc': [
          // Require JSDoc comments
          'warn',
          {
            require: {
              FunctionDeclaration: true, // function()
              MethodDefinition: true, // methods of classes
              ClassDeclaration: true, // classes
              FunctionExpression: true // const name = () =>
            }
          }
        ]
      }
    }
  ]
};
