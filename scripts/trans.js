#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

function generateTranslationFile(language) {
  const folderPath = getI18nPath(language);
  const filePath = path.resolve(folderPath, "translations.json");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  const files = fs.readdirSync(folderPath);
  const trans = {};
  files.forEach(file => {
    console.log(
      `${chalk.green("[>]")} ${chalk.dim(
        "Successfully imported"
      )} ${file} in ${chalk.dim(filePath)}`
    );
    const content = fs.readFileSync(path.resolve(folderPath, file), "utf8");
    trans[formatKey(file)] = JSON.parse(content);
  });

  fs.writeFileSync(filePath, JSON.stringify(trans), "utf8");
}

// remove .json from file name
function formatKey(key) {
  return key.slice(0, -5);
}
function getI18nPath(language) {
  return path.resolve(__dirname, `../src/assets/i18n/${language}`);
}

generateTranslationFile("en");
