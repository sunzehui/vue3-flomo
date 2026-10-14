import antfu from '@antfu/eslint-config'

export default antfu({
  // Enable stylistic formatting rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  ignores: [
    'dist',
    'node_modules',
    // 由构建工具生成的声明文件
    'components.d.ts',
  ],
  rules: {
    'antfu/top-level-function': 'off',
  },
})
