// eslint-disable-next-line @typescript-eslint/no-var-requires
const typeEnum = require('./cz-customizable.config');

/**
 * @see https://commitlint.js.org/
 * @see https://juejin.cn/post/6979054290526535717
 * 默认 @commitlint/config-conventional 约束规则 &&  自定义约束规则
 * 约束调用方 @commitlint/cli
 */
module.exports = {
  // 扩展默认的 commitlint 规则
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 定义允许的提交类型，2 表示错误，always 表示必须，typeEnum.types.map((i) => i.value) 表示允许的类型
    'type-enum': [2, 'always', typeEnum.types.map((i) => i.value)],
    // 设置提交类型的格式为小写，0 表示忽略，always 表示必须，lower-case 表示小写
    'type-case': [0, 'always', 'lower-case'],
    // 限制提交主题的最大长度，2 表示错误，always 表示必须，typeEnum.subjectLimit 表示最大长度
    'subject-max-length': [2, 'always', typeEnum.subjectLimit],
  },
};
