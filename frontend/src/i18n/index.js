import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resources from './locales'

console.log(resources)

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    }
  })

export { i18n, useTranslation }
