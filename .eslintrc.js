module.exports = {
  // 此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
  // 解析器  https://eslint.vuejs.org/user-guide/#usage
  // parser: 'vue-eslint-parser',
  // parserOptions: {
  //     'parser': 'babel-eslint',
  //     'sourceType': 'module'
  // },
  // 指定环境
  env: {
    node: true,
    es6: true
  },
  // 在这里添加更多的通用规则集  https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'eslint:recommended' // 设置此项会开启所有eslint推荐的规则 详见 http://eslint.cn/docs/rules/
  ],
  // 插件 检测 .vue 文件
  // plugins: [
  //     // 'html'
  //     'vue'
  // ],

  /**
    * "off"或者0    关闭规则关闭
    * "warn"或者1    在打开的规则作为警告（不影响退出代码）
    * "error"或者2    把规则作为一个错误（退出代码触发时为1）
    */
  rules: {
    'semi': 1,
    'quotes': [1, 'single'], // 引号类型
    'no-unused-vars': 0, // 检查未使用变量
    'no-undef': 0, // 检查未定义就使用变量
    'no-useless-escape': 0, // 转义符
    'indent': [1, 2], // 缩进风格
    'no-trailing-spaces': 1, // 一行结束后面不要有空格
    'spaced-comment': 1, // 注释风格要不要有空格什么的
    'space-unary-ops': [1, { 'words': true, 'nonwords': false }],
    'array-bracket-spacing': [1, 'never'], // 数组前后不加空格
    'object-curly-spacing': [1, 'always'],  // 对象前后加空格
    'space-before-blocks': 1, // 代码块前后空格
    'comma-dangle': [1, 'never'], // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    'comma-spacing': [1, { 'before': false, 'after': true }], // 控制逗号前后的空格
    'key-spacing': [1, { 'beforeColon': false, 'afterColon': true }]// 对象字面量中冒号的前后空格
  }
};