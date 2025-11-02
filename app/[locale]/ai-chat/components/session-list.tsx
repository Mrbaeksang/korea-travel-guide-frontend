'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  useAiChatSessions,
  useCreateAiChatSession,
  useDeleteAiChatSession,
  useUpdateAiChatSessionTitle,
} from '@/hooks/use-ai-chat'

interface SessionListProps {
  selectedSessionId: number | null
  onSelectSession: (sessionId: number) => void
}

export function SessionList({
  selectedSessionId,
  onSelectSession,
}: SessionListProps) {
  const t = useTranslations('aiChat')
  const tc = useTranslations('common')
  const { data: sessions = [], isLoading } = useAiChatSessions()
  const createSession = useCreateAiChatSession()
  const deleteSession = useDeleteAiChatSession()
  const updateTitle = useUpdateAiChatSessionTitle()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleCreateSession = () => {
    createSession.mutate(undefined, {
      onSuccess: (newSession) => {
        onSelectSession(newSession.sessionId)
      },
    })
  }

  const handleDeleteSession = (sessionId: number) => {
    if (confirm(t('deleteConfirm'))) {
      deleteSession.mutate(sessionId, {
        onSuccess: () => {
          if (selectedSessionId === sessionId) {
            onSelectSession(null as any)
          }
        },
      })
    }
  }

  const handleStartEdit = (sessionId: number, currentTitle: string) => {
    setEditingId(sessionId)
    setEditTitle(currentTitle)
  }

  const handleSaveTitle = (sessionId: number) => {
    if (editTitle.trim()) {
      updateTitle.mutate(
        { sessionId, newTitle: editTitle },
        {
          onSuccess: () => {
            setEditingId(null)
          },
        }
      )
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  if (isLoading) {
    return (
      <div className="h-full w-full border-r border-gray-200 bg-white p-4 md:w-80">
        <div className="flex items-center justify-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col border-r border-gray-200 bg-white md:w-80">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('title')}</h2>
        <button
          onClick={handleCreateSession}
          disabled={createSession.isPending}
          className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
        >
          {createSession.isPending ? t('creating') : t('newSession')}
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            {t('noSessions')}
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className={`group relative rounded-lg p-3 transition-colors ${
                  selectedSessionId === session.sessionId
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {editingId === session.sessionId ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveTitle(session.sessionId)
                        } else if (e.key === 'Escape') {
                          handleCancelEdit()
                        }
                      }}
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSaveTitle(session.sessionId)}
                        className="flex-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        {tc('save')}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300"
                      >
                        {tc('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectSession(session.sessionId)}
                      className="w-full text-left"
                    >
                      <p className="truncate text-sm font-medium text-gray-900">
                        {session.sessionTitle}
                      </p>
                    </button>

                    {/* Action Buttons */}
                    <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
                      <button
                        onClick={() =>
                          handleStartEdit(
                            session.sessionId,
                            session.sessionTitle
                          )
                        }
                        className="rounded p-1 hover:bg-gray-200"
                        title={t('editTitle')}
                      >
                        <svg
                          className="h-4 w-4 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.sessionId)}
                        className="rounded p-1 hover:bg-red-100"
                        title={t('deleteSession')}
                      >
                        <svg
                          className="h-4 w-4 text-red-600"
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
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
