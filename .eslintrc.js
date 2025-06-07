module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
  overrides: [
    {
      files: ['server/**/*.ts'],
      parserOptions: {
        project: ['./server/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ['client/**/*.ts', 'client/**/*.tsx'],
      parserOptions: {
        project: ['./client/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ['client/vite.config.ts'],
      parserOptions: {
        project: ['./client/tsconfig.node.json'],
        tsconfigRootDir: __dirname,
      },
    }
  ],
}; 