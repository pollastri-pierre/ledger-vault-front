import i18n from "i18next";
import translations from "assets/i18n/en/translations.json";

i18n.init({
  lng: "en",
  resources: {
    en: { translation: translations }
  }
});
export default i18n;
