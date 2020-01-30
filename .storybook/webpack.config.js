const path = require("path");

module.exports = ({ config }) => {

  // disable react-docgen plugin
  // see https://github.com/storybookjs/storybook/issues/7743
  config.module.rules[0].use[0].options.plugins.pop();

  config.module.rules = config.module.rules.map(rule => {
    const ruleTestStr = rule.test.toString();
    if (ruleTestStr.includes("svg")) return { ...rule, loader: "file-loader" };
    return rule;
  });
  return config;
};
