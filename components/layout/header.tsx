'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/use-auth-store'
import { useUser } from '@/hooks/use-user'
import api from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useTranslations } from 'next-intl'

export function Header() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { data: userData } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('header')
  const tCommon = useTranslations('common')

  // Zustand store의 user가 없으면 useUser hook에서 가져온 데이터 사용
  const currentUser = user || userData

  const handleLogout = async () => {
    try {
      // FRONTEND_API.md Section 1.4: 로그아웃
      await api.post<ApiResponse<null>>('/api/auth/logout')

      logout()
      toast.success('로그아웃되었습니다.')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // 에러가 발생해도 클라이언트 상태는 초기화
      logout()
      router.push('/login')
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xl font-bold text-gray-900">
                {t('title')}
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          {isAuthenticated && currentUser && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 sm:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          {/* Navigation & User Menu */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {isAuthenticated && currentUser ? (
              <>
                {/* Desktop Navigation */}
                <div className="hidden items-center gap-4 sm:flex">
                  <Link
                    href="/ai-chat"
                    className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                  >
                    {t('aiChat')}
                  </Link>
                  {currentUser.role === 'GUIDE' && (
                    <Link
                      href="/chat"
                      className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                    >
                      {t('chat')}
                    </Link>
                  )}
                  {currentUser.role === 'USER' && (
                    <Link
                      href="/guides"
                      className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                    >
                      {t('findGuide')}
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                  >
                    {t('myProfile')}
                  </Link>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex items-center gap-2">
                    {currentUser.profileImageUrl ? (
                      <img
                        src={currentUser.profileImageUrl}
                        alt={currentUser.nickname}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                        {currentUser.nickname[0]}
                      </div>
                    )}
                    <div className="hidden flex-col sm:flex">
                      <span className="text-sm font-medium text-gray-900">
                        {currentUser.nickname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {currentUser.role === 'USER'
                          ? t('traveler')
                          : currentUser.role === 'GUIDE'
                            ? t('guide')
                            : currentUser.role}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {tCommon('logout')}
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {tCommon('login')}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && currentUser && isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 sm:hidden">
            <div className="space-y-2">
              <Link
                href="/ai-chat"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                {t('aiChat')}
              </Link>
              {currentUser.role === 'GUIDE' && (
                <Link
                  href="/chat"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {t('chat')}
                </Link>
              )}
              {currentUser.role === 'USER' && (
                <Link
                  href="/guides"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {t('findGuide')}
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                {t('myProfile')}
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLogout()
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-gray-100"
              >
                {tCommon('logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
