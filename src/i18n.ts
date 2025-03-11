import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr', // Langue par défaut si la langue détectée n'est pas disponible
    debug: process.env.NODE_ENV === 'development', // Activer le mode debug en développement

    interpolation: {
      escapeValue: false,
    },

    // Options de détection de la langue
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },

    // Options de chargement des traductions
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Espaces de noms (namespaces)
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;
