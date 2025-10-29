import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import gr from "../locales/gr.json";

const languageResources = {
  en: { translation: en, name: "English", nativeName: "English", flag: "🇬🇧" },
  gr: { translation: gr, name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
};

export const languages = Object.fromEntries(
  Object.entries(languageResources).map(([key, value]) => {
    const { translation, ...rest } = value;
    return [key, rest];
  })
);

export const setLocale = (locale) => {
  i18next.changeLanguage(locale);
};

export const getCurrentLocale = () => i18next.language;

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  fallbackLng: "en",
  resources: languageResources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
