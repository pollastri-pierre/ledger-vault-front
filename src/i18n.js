import i18n from "i18next";
import resources from "../locales";

i18n.init({
  lng: "en",
  fallbackLng: "en",
  resources,
  debug: false,
});
export default i18n;
