'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/use-auth-store'
import type { ApiResponse, User } from '@/types/api'

interface GuideRating {
  id: number
  raterNickname: string
  rating: number
  comment: string | null
  createdAt: string
}

interface GuideRatingsResponse {
  averageRating: number
  totalRatings: number
  ratings: GuideRating[]
}

export default function ProfilePage() {
  const t = useTranslations('profile')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const { user, accessToken, setUser, clearAuth } = useAuthStore()

  // Form states
  const [nickname, setNickname] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  // Guide ratings state
  const [guideRatings, setGuideRatings] = useState<GuideRatingsResponse | null>(null)

  // UI states
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    // Check authentication
    if (!user || !accessToken) {
      router.push('/login')
      return
    }

    // Initialize form with user data
    setNickname(user.nickname || '')
    setProfileImageUrl(user.profileImageUrl || '')

    // Load guide-specific data if GUIDE role
    if (user.role === 'GUIDE') {
      loadGuideData()
      loadGuideRatings()
    }
  }, [user, accessToken, router])

  const loadGuideData = async () => {
    try {
      const response = await api.get<ApiResponse<User>>(`/api/guides/${user!.id}`)
      const guideData = response.data.data
      setLocation(guideData.location || '')
      setDescription(guideData.description || '')
    } catch (error) {
      console.error('Failed to load guide data:', error)
    }
  }

  const loadGuideRatings = async () => {
    try {
      const response = await api.get<ApiResponse<GuideRatingsResponse>>('/api/rate/guides/my', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setGuideRatings(response.data.data)
    } catch (error) {
      console.error('Failed to load guide ratings:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!accessToken) return

    setIsLoading(true)
    try {
      // FRONTEND_API.md Section 2.2: Update user profile
      const userUpdatePayload: { nickname?: string; profileImageUrl?: string } = {}
      if (nickname !== user?.nickname) userUpdatePayload.nickname = nickname
      if (profileImageUrl !== user?.profileImageUrl) userUpdatePayload.profileImageUrl = profileImageUrl

      if (Object.keys(userUpdatePayload).length > 0) {
        const response = await api.patch<ApiResponse<User>>('/api/users/me', userUpdatePayload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setUser(response.data.data)
      }

      // FRONTEND_API.md Section 7.3: Update guide profile (GUIDE only)
      if (user?.role === 'GUIDE') {
        const guideUpdatePayload: { location?: string; description?: string } = {}
        if (location) guideUpdatePayload.location = location
        if (description) guideUpdatePayload.description = description

        if (Object.keys(guideUpdatePayload).length > 0) {
          await api.patch('/api/guides/me', guideUpdatePayload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        }
      }

      toast.success(t('updated'))
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(t('updateFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!accessToken) return

    setIsLoading(true)
    try {
      // FRONTEND_API.md Section 2.3: Delete account
      await api.delete('/api/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      toast.success(t('deleteAccount.success'))
      clearAuth()
      router.push('/login')
    } catch (error) {
      console.error('Failed to delete account:', error)
      toast.error(t('deleteAccount.failed'))
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        {/* Profile Image */}
        <div className="mb-6 flex items-center gap-6">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200">
            {(isEditing ? profileImageUrl : user.profileImageUrl) ? (
              <img
                src={isEditing ? profileImageUrl : user.profileImageUrl!}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-400">
                {user.nickname?.charAt(0) || '?'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.nickname || t('noName')}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                user.role === 'GUIDE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {user.role === 'GUIDE' ? t('roleGuide') : t('roleGuest')}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-4">
          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('nickname')}</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('profileImage')}
            </label>
            <input
              type="url"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              disabled={!isEditing}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">{t('profileImageDesc')}</p>
          </div>

          {/* Guide-specific fields */}
          {user.role === 'GUIDE' && (
            <>
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('location')}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!isEditing}
                  placeholder={t('locationPlaceholder')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder={t('descriptionPlaceholder')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('editProfile')}
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300"
                >
                  {isLoading ? t('saving') : tCommon('save')}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setNickname(user.nickname || '')
                    setProfileImageUrl(user.profileImageUrl || '')
                    if (user.role === 'GUIDE') {
                      loadGuideData()
                    }
                  }}
                  disabled={isLoading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-100"
                >
                  {tCommon('cancel')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Guide Ratings Section */}
      {user.role === 'GUIDE' && guideRatings && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{t('myRatings')}</h2>

          {/* Rating Summary */}
          <div className="mb-6 flex items-center gap-6 rounded-lg bg-gray-50 p-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {guideRatings.averageRating.toFixed(1)}
              </div>
              <div className="mt-1 text-sm text-gray-600">{t('averageRating')}</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {guideRatings.totalRatings}
              </div>
              <div className="mt-1 text-sm text-gray-600">{t('totalRatings')}</div>
            </div>
          </div>

          {/* Ratings List */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">{t('receivedRatings')}</h3>
            {guideRatings.ratings.length === 0 ? (
              <p className="text-sm text-gray-500">{t('noRatings')}</p>
            ) : (
              <div className="space-y-3">
                {guideRatings.ratings.map((rating) => (
                  <div key={rating.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {rating.raterNickname}
                        </span>
                        <span className="text-yellow-500">
                          {'★'.repeat(rating.rating)}
                          {'☆'.repeat(5 - rating.rating)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="mt-2 text-sm text-gray-600">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Section */}
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-red-900">{t('deleteAccount.title')}</h2>
        <p className="mb-4 text-sm text-red-700">
          {t('deleteAccount.warning')}
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t('deleteAccount.button')}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="font-medium text-red-900">{t('deleteAccount.confirmTitle')}</p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-300"
              >
                {isLoading ? t('deleteAccount.processing') : tCommon('confirm')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-100"
              >
                {tCommon('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
