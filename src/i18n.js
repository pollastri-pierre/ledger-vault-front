import i18n from "i18next";
import resources from "../locales";

i18n.init({
  fallbackLng: "en",
  resources: resources,
  debug: true
});
export default i18n;
