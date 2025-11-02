import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// 지원하는 언어 목록
export const locales = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'de', 'fr', 'es', 'ru'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский',
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'ko' // fallback to default
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
