module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  settings: { react: { version: 'detect' } },
  plugins: ['react', '@typescript-eslint', 'jsx-a11y'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jsx-a11y/recommended', 'prettier'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
      rules: { '@typescript-eslint/no-explicit-any': 'error', 'react/react-in-jsx-scope': 'off' }
    }
  ]
}
