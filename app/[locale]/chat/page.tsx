'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useChatRooms, useDeleteChatRoom } from '@/hooks/use-user-chat'
import { useAuthStore } from '@/stores/use-auth-store'
import { useEffect } from 'react'

export default function ChatListPage() {
  const t = useTranslations('chat')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const { user } = useAuthStore()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatRooms()
  const deleteRoom = useDeleteChatRoom()

  // GUIDE가 아니면 홈으로 리다이렉트
  useEffect(() => {
    if (user && user.role !== 'GUIDE') {
      router.push('/')
    }
  }, [user, router])

  const handleDeleteRoom = (roomId: number, roomTitle: string) => {
    if (confirm(t('deleteConfirm', { title: roomTitle }))) {
      deleteRoom.mutate(roomId)
    }
  }

  const handleRoomClick = (roomId: number) => {
    router.push(`/chat/${roomId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (days === 1) {
      return t('yesterday')
    } else if (days < 7) {
      return t('daysAgo', { days })
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    )
  }

  const allRooms = data?.pages.flatMap((page) => page.rooms) ?? []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('listTitle')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('listDescription')}
        </p>
      </div>

      {/* Chat Room List */}
      {allRooms.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t('noRooms')}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {t('noRoomsDescription')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {allRooms.map((room) => (
            <div
              key={room.id}
              className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => handleRoomClick(room.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {room.displayTitle}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('lastUpdate')}: {formatDate(room.updatedAt)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteRoom(room.id, room.displayTitle)
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    title={t('deleteButton')}
                  >
                    <svg
                      className="h-5 w-5 text-red-600 hover:text-red-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </button>
            </div>
          ))}

          {/* Load More Button */}
          {hasNextPage && (
            <div className="pt-4 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
              >
                {isFetchingNextPage ? t('loadingMore') : t('loadMore')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
