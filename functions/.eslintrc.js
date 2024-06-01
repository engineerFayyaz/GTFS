module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    'quotes': ['error', 'double', { 'allowTemplateLiterals': true }],
    'linebreak-style': ['error', 'unix'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['error', { 'code': 80 }],
    'new-cap': ['error', { 'capIsNewExceptions': ['String', 'Number', 'Boolean'] }], // Only enforce for user-defined constructors
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
    },
  ],
  globals: {},
};
