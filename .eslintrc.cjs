// This config file is used by eslint
// See package.json scripts: lint
// Rules documentation: https://eslint.org/docs/rules/

module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: false,
    es6: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021
  },
  extends: [
    // See https://github.com/standard/eslint-config-standard/blob/master/eslintrc.json
    'standard'
  ],
  plugins: [
    'svelte3'
  ],
  rules: {
    'array-bracket-spacing': [ 'error', 'always' ],
    // Some map functions may implicitly return undefined,
    // for instance to have it later filtered-out from the array
    'array-callback-return': 'off',
    'arrow-parens': [ 'error', 'as-needed' ],
    'comma-dangle': [
      'error',
      {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'never'
      }
    ],
    eqeqeq: [ 'error', 'smart' ],
    'implicit-arrow-linebreak': [ 'error', 'beside' ],
    indent: [ 'error', 2, { MemberExpression: 'off' } ],
    // Making the rule settings explicit to prevent to get warnings with svelte components
    // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/82
    'no-multiple-empty-lines': [ 'error', { max: 1, maxBOF: 0, maxEOF: 1 } ],
    // svelte components initialization are a "new" with side-effect
    'no-new': 'off',
    'no-var': [ 'error' ],
    'nonblock-statement-body-position': [ 'error', 'beside' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'object-shorthand': [ 'error', 'properties' ],
    // Being able to define several variables on a single line comes very handy with Svelte
    'one-var': 'off',
    'prefer-const': [ 'error' ]
  },
  overrides: [
    {
      files: [ '*.svelte' ],
      processor: 'svelte3/svelte3',
      rules: {
        // In Svelte, assignment is used everywhere to update a componenent's state;
        // Turning off this rule allows to write less curly-brackets-loaded inline functions
        // Example:      on:click={() => zoom = !zoom }
        // instead of:   on:click={() => { zoom = !zoom }}
        'no-return-assign': 'off',
        // Rules known to not work correctly with eslint-plugin-svelte3
        // See https://github.com/sveltejs/eslint-plugin-svelte3/blob/master/OTHER_PLUGINS.md#eslint-plugin-import
        'import/first': 'off',
      }
    }
  ],
  globals: {
    browser: 'readable',
    chrome: 'readable',
  }
}
