'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('about.title')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {t('about.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('links.title')}</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href={`/${locale}/ai-chat`}
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  {t('links.aiChat')}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/guides`}
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  {t('links.findGuide')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('contact.title')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              <a
                href={`mailto:${t('contact.email')}`}
                className="transition-colors hover:text-blue-600"
              >
                {t('contact.email')}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  )
}
