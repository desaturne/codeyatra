import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import np from "./np";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    np: { translation: np },
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
