import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  // Any other config imports go at the top
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/eslint.config.mjs',
      '**/webpack.config.js',
      '**/package.json',
      'cz-customizable.config.js',
      'commitlint.config.js',
      '.vscode',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      'prettier/prettier': ['off', { endOfLine: 'auto' }],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: [
            'arrowFunctions', // 允许空的箭头函数
            'protected-constructors', // 允许受保护的空构造函数
            'private-constructors', // 允许私有的空构造函数
            'decoratedFunctions', // 允许带装饰器的空函数
            // 'methods',                // 允许空的类方法
            // 'constructors',           // 允许空的构造函数
            // 'functions',              // 允许空的普通函数
            // 'asyncFunctions',         // 允许空的异步函数
            // 'generatorFunctions',     // 允许空的生成器函数
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: true,
          ignoreRestArgs: false,
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      // 配置未使用变量的检查规则
      '@typescript-eslint/no-unused-vars': [
        'error', // 违反规则时报错
        {
          args: 'all', // 检查所有函数参数
          argsIgnorePattern: '^_', // 忽略以下划线开头的参数，如 _unused
          caughtErrors: 'all', // 检查所有 catch 语句中的错误参数
          caughtErrorsIgnorePattern: '^_', // 忽略 catch 中以下划线开头的错误参数
          destructuredArrayIgnorePattern: '^_', // 忽略解构数组中以下划线开头的变量
          varsIgnorePattern: '^_', // 忽略以下划线开头的变量
          ignoreRestSiblings: true, // 忽略剩余参数中未使用的属性
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'public-static-get',
            'public-static-set',
            'public-static-method',
            'protected-static-field',
            'protected-static-get',
            'protected-static-set',
            'protected-static-method',
            'private-static-field',
            'private-static-get',
            'private-static-set',
            'private-static-method',
            'signature',
            'public-abstract-field',
            'protected-abstract-field',
            'public-decorated-field',
            'public-instance-field',
            'protected-decorated-field',
            'protected-instance-field',
            'private-decorated-field',
            'private-instance-field',
            'public-constructor',
            'protected-constructor',
            'private-constructor',
            'public-abstract-get',
            'public-abstract-set',
            'public-abstract-method',
            'public-decorated-get',
            'public-instance-get',
            'public-decorated-set',
            'public-instance-set',
            'public-decorated-method',
            'public-instance-method',
            'protected-abstract-get',
            'protected-abstract-set',
            'protected-abstract-method',
            'protected-decorated-get',
            'protected-instance-get',
            'protected-decorated-set',
            'protected-instance-set',
            'protected-decorated-method',
            'protected-instance-method',
            'private-decorated-get',
            'private-instance-get',
            'private-decorated-set',
            'private-instance-set',
            'private-decorated-method',
            'private-instance-method',
          ],
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  // 对测试文件放宽检查 - 放在最后确保不被覆盖
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.d.ts'], // 针对所有 .d.ts 文件
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // 关闭未使用变量检查
    },
  },
];
