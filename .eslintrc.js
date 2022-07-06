module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    API: 'readonly'
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:prettier/recommended' // 添加 prettier 插件
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'vue/no-v-model-argument': 0,
    'no-console': 0,
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
  }
}
