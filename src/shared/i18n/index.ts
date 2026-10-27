import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import id from './locales/id.json'

export const locales = [
  { code: 'id', labelKey: 'common.langId' },
  { code: 'en', labelKey: 'common.langEn' },
] as const

export type AppLocale = (typeof locales)[number]['code']

const STORAGE_KEY = 'hs-locale'

function readStoredLocale(): AppLocale {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'id') return saved
  const browser = navigator.language.toLowerCase()
  return browser.startsWith('en') ? 'en' : 'id'
}

void i18n.use(initReactI18next).init({
  resources: {
    id: { translation: id },
    en: { translation: en },
  },
  lng: readStoredLocale(),
  fallbackLng: 'id',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.lang = lng
})

document.documentElement.lang = i18n.language

export { i18n }
