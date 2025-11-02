'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { locales, localeNames, type Locale } from '@/i18n'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false)
    startTransition(() => {
      // Remove current locale from pathname if present
      let pathnameWithoutLocale = pathname

      // Check if pathname starts with a locale
      for (const loc of locales) {
        if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
          pathnameWithoutLocale = pathname.slice(`/${loc}`.length) || '/'
          break
        }
      }

      // Navigate to new locale (always with prefix now)
      router.push(`/${newLocale}${pathnameWithoutLocale}`)

      // Force refresh to ensure proper locale change
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span>{localeNames[locale as Locale]}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  loc === locale ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {localeNames[loc]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
