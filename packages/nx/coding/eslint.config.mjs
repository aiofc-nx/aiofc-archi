import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: [
      '**/package.json',
      '**/package.json',
      '**/generators.json',
      '**/schema.json',
    ],
    rules: {
      '@nx/nx-plugin-checks': 'error',
      'prettier/prettier': ['off', { endOfLine: 'auto' }],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
