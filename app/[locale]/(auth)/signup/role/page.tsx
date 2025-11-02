'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/use-auth-store'
import type { ApiResponse, User, UserRole } from '@/types/api'
import { useLocale } from 'next-intl'

function RoleSelectionContent() {
  const t = useTranslations('auth.role')
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<'USER' | 'GUIDE' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registerToken, setRegisterToken] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      toast.error(t('invalidAccess'))
      router.push(`/${locale}/login`)
      return
    }
    setRegisterToken(token)
  }, [searchParams, router, locale, t])

  const handleRoleSelect = async () => {
    if (!selectedRole || !registerToken) return

    setIsSubmitting(true)

    try {
      // FRONTEND_API.md Section 1.2: 역할 선택 (신규 사용자만)
      const response = await api.post<ApiResponse<{ accessToken: string }>>(
        '/api/auth/role',
        {
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${registerToken}`,
          },
        }
      )

      const accessToken = response.data.data.accessToken

      // FRONTEND_API.md Section 2.1: 내 정보 조회
      const userResponse = await api.get<ApiResponse<User>>('/api/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const user = userResponse.data.data

      console.log('[Role Selection] Setting auth:', { accessToken: !!accessToken, user })

      // Zustand store에 인증 정보 저장
      setAuth(accessToken, user)

      console.log('[Role Selection] Auth set successfully')

      toast.success(t('success'))

      // 리다이렉트 URL이 있으면 해당 페이지로, 없으면 홈으로
      const redirectUrl = searchParams.get('redirect') || `/${locale}`
      console.log('[Role Selection] Redirecting to:', redirectUrl)
      router.push(redirectUrl)
    } catch (error) {
      console.error('Role selection error:', error)
      toast.error(t('error'))
      setIsSubmitting(false)
    }
  }

  if (!registerToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* USER 역할 */}
          <button
            onClick={() => setSelectedRole('USER')}
            disabled={isSubmitting}
            className={`group relative overflow-hidden rounded-lg border-2 p-6 text-left transition-all ${
              selectedRole === 'USER'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t('traveler.title')}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t('traveler.description')}
                </p>
              </div>
              <div
                className={`h-6 w-6 rounded-full border-2 transition-all ${
                  selectedRole === 'USER'
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {selectedRole === 'USER' && (
                  <svg
                    className="h-full w-full text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t('traveler.feature1')}
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t('traveler.feature2')}
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t('traveler.feature3')}
              </li>
            </ul>
          </button>

          {/* GUIDE 역할 */}
          <button
            onClick={() => setSelectedRole('GUIDE')}
            disabled={isSubmitting}
            className={`group relative overflow-hidden rounded-lg border-2 p-6 text-left transition-all ${
              selectedRole === 'GUIDE'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300'
            } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t('guide.title')}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t('guide.description')}
                </p>
              </div>
              <div
                className={`h-6 w-6 rounded-full border-2 transition-all ${
                  selectedRole === 'GUIDE'
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {selectedRole === 'GUIDE' && (
                  <svg
                    className="h-full w-full text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t('guide.feature1')}
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t('guide.feature2')}
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t('guide.feature3')}
              </li>
            </ul>
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole || isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting ? t('processing') : t('continue')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RoleSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      }
    >
      <RoleSelectionContent />
    </Suspense>
  )
}
