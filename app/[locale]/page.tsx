'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/use-auth-store'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const t = useTranslations('home')

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/ai-chat"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t('hero.aiChatButton')}
                </Link>
                {user.role === 'USER' && (
                  <Link
                    href="/guides"
                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    {t('hero.findGuideButton')}
                  </Link>
                )}
                {user.role === 'GUIDE' && (
                  <Link
                    href="/chat"
                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    {t('hero.myChatButton')}
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t('hero.startButton')}
                </Link>
                <Link
                  href="#features"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                >
                  {t('hero.learnMore')}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Official Data Sources Section */}
      <section className="border-y border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('officialData.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('officialData.subtitle')}
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {/* Korea Meteorological Administration */}
            <div className="flex items-center justify-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-blue-900">
                  {t('officialData.kma.name')}
                </h3>
                <p className="text-sm text-blue-700">
                  {t('officialData.kma.description')}
                </p>
              </div>
            </div>

            {/* Korea Tourism Organization */}
            <div className="flex items-center justify-center gap-4 rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-green-600">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-green-900">
                  {t('officialData.kto.name')}
                </h3>
                <p className="text-sm text-green-700">
                  {t('officialData.kto.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('features.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* AI Chatbot */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">{t('features.aiChatbot.title')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {t('features.aiChatbot.description')}
            </p>
          </div>

          {/* Local Guides */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {t('features.localGuides.title')}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {t('features.localGuides.description')}
            </p>
          </div>

          {/* Real-time Chat */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {t('features.realTimeChat.title')}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {t('features.realTimeChat.description')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-blue-600 px-6 py-16 text-center shadow-xl sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              {t('cta.subtitle')}
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-gray-50"
              >
                {t('cta.button')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
