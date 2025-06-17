module.exports = {
    extends: ['react-app'],
    // 禁用冲突的规则
    rules: {
      // 可以根据需要添加或覆盖规则
    },
    // 明确指定解析器
    parser: '@babel/eslint-parser',
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-react']
      }
    }
  };