module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': 0,
    'func-names': 0,
    'object-shorthand': 0,
    'max-len': 0,
    'no-alert': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
