'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/use-auth-store'
import type { ApiResponse, User } from '@/types/api'
import { useLocale } from 'next-intl'

function OAuthCallbackContent() {
  const t = useTranslations('auth.callback')
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // FRONTEND_API.md Section 1.1: 기존 사용자는 쿠키에 refreshToken이 자동 설정됨
        // Access token 갱신 시도 (HttpOnly 쿠키는 자동으로 전송됨)
        const refreshResponse = await api.post<ApiResponse<{ accessToken: string }>>(
          '/api/auth/refresh'
        )

        const accessToken = refreshResponse.data.data.accessToken

        // FRONTEND_API.md Section 2.1: 내 정보 조회
        const userResponse = await api.get<ApiResponse<User>>('/api/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const user = userResponse.data.data

        // Zustand store에 인증 정보 저장
        setAuth(accessToken, user)

        // 리다이렉트 URL이 있으면 해당 페이지로, 없으면 홈으로
        const redirectUrl = searchParams.get('redirect') || `/${locale}`
        router.push(redirectUrl)
      } catch (err) {
        console.error('[OAuth Callback] Error:', err)
        setError(t('error'))
        setTimeout(() => {
          router.push(`/${locale}/login`)
        }, 3000)
      }
    }

    handleCallback()
  }, [router, searchParams, setAuth, locale])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <p className="mt-2 text-sm text-gray-600">{t('redirecting')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">{t('processing')}</p>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  )
}
