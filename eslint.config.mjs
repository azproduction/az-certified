import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  // Disable rules that conflict with Next.js or our setup
  rules: {
    'react/prefer-destructuring-assignment': 'off',
    'node/prefer-global/process': 'off',
    'ts/consistent-type-definitions': 'off',
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'no-alert': 'off',
    'react/no-array-index-key': 'warn',
  },

  ignores: [
    '.next',
    'out',
    'node_modules',
    '*.config.js',
    '*.config.ts',
    '*.md',
  ],
})
