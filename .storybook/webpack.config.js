const path = require("path");

module.exports = ({ config }) => {
  config.module.rules = config.module.rules.map(rule => {
    const ruleTestStr = rule.test.toString();
    if (ruleTestStr.includes("svg")) return { ...rule, loader: "file-loader" };
    return rule;
  });
  return config;
};
