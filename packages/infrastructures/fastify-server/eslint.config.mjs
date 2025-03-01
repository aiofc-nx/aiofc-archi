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
      'prettier/prettier': ['off', { endOfLine: 'auto' }],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
