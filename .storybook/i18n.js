import i18n from "i18next";

const req = require.context("../locales/en", true, /.json/);

const resources = req.keys().reduce((result, file) => {
  const [, fileName] = file.match(/\.\/(.*)\.json/);
  result[fileName] = req(file);
  return result;
}, {});

i18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: resources,
  },
  debug: false,
});

export default i18n;
