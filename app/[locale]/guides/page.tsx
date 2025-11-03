'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/use-auth-store'
import { useGuides } from '@/hooks/use-guide'
import { useCreateChatRoom } from '@/hooks/use-user-chat'

export default function GuidesPage() {
  const t = useTranslations('guides')
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: guides, isLoading } = useGuides()
  const createChatRoom = useCreateChatRoom()

  const [searchQuery, setSearchQuery] = useState('')

  // Filter guides by search query (nickname or location)
  const filteredGuides = guides?.filter((guide) => {
    const query = searchQuery.toLowerCase()
    return (
      guide.nickname.toLowerCase().includes(query) ||
      guide.location?.toLowerCase().includes(query) ||
      guide.description?.toLowerCase().includes(query)
    )
  })

  const handleStartChat = async (guideId: number) => {
    if (!user) {
      toast.error(t('loginRequired'))
      router.push('/login')
      return
    }

    if (user.role !== 'USER') {
      toast.error(t('travelerOnly'))
      return
    }

    try {
      const chatRoom = await createChatRoom.mutateAsync({
        guideId,
        userId: user.id,
      })

      toast.success(t('chatCreated'))
      router.push(`/chat/${chatRoom.id}`)
    } catch (error) {
      console.error('Failed to create chat room:', error)
      toast.error(t('chatCreationFailed'))
    }
  }

  if (!user) {
    router.push('/login')
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    )
  }

  if (user.role !== 'USER') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('accessDenied.title')}</h1>
          <p className="mt-2 text-gray-600">{t('accessDenied.description')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      {/* Guides Grid */}
      {!isLoading && filteredGuides && filteredGuides.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => {
            // Calculate profile completion (for badge)
            const hasProfileImage = !!guide.profileImageUrl
            const hasDescription = !!guide.description
            const hasLocation = !!guide.location
            const isVerifiedGuide = hasProfileImage && hasDescription && hasLocation

            return (
              <div
                key={guide.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-200"
              >
                {/* Profile Image with Badge */}
                <div className="relative mb-4 flex justify-center">
                  {guide.profileImageUrl ? (
                    <img
                      src={guide.profileImageUrl}
                      alt={guide.nickname}
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-100"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-3xl font-bold text-white ring-2 ring-blue-100">
                      {guide.nickname[0]}
                    </div>
                  )}

                  {/* Verified Badge */}
                  {isVerifiedGuide && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
                      <div className="flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white shadow-md">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Verified</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guide Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {guide.nickname}
                  </h3>

                  {/* Location Badge */}
                  {guide.location && (
                    <div className="mt-2 flex justify-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {guide.location}
                      </span>
                    </div>
                  )}

                  {/* Star Rating Placeholder */}
                  <div className="mt-3 flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">(0)</span>
                  </div>

                  {guide.description && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                      {guide.description}
                    </p>
                  )}
                </div>

                {/* Chat Button */}
                <button
                  onClick={() => handleStartChat(guide.id)}
                  disabled={createChatRoom.isPending}
                  className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createChatRoom.isPending ? t('creating') : t('startChat')}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredGuides && filteredGuides.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-600">
            {searchQuery ? t('noResults') : t('noGuides')}
          </p>
        </div>
      )}
    </div>
  )
}
