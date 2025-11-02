'use client'

import { useEffect, useRef, useState } from 'react'
import { useAiChatMessages, useSendAiChatMessage } from '@/hooks/use-ai-chat'
import { MessageContent } from './message-content'
import { useTranslations } from 'next-intl'

interface ChatAreaProps {
  sessionId: number | null
  onSampleQuestionClick: (question: string) => void
}

export function ChatArea({ sessionId, onSampleQuestionClick }: ChatAreaProps) {
  const { data: messages = [], isLoading } = useAiChatMessages(sessionId)
  const sendMessage = useSendAiChatMessage(sessionId)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef(0)
  const t = useTranslations('aiChat')
  const tc = useTranslations('common')

  // Auto-scroll to bottom ONLY when new messages are added
  useEffect(() => {
    // Only scroll if messages were added (not on initial load or session change)
    if (messages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevMessageCountRef.current = messages.length
  }, [messages])

  // Reset counter when session changes
  useEffect(() => {
    prevMessageCountRef.current = 0
  }, [sessionId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sessionId) return

    sendMessage.mutate(input, {
      onSuccess: () => {
        setInput('')
      },
    })
  }

  if (!sessionId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t('selectSession')}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {t('selectSessionDesc')}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="text-sm text-gray-600">{tc('loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              {/* Welcome Message */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {t('startConversation')}
                </h3>
                <p className="text-sm text-gray-500">{t('onboarding.tryAsking')}</p>
              </div>

              {/* Sample Question Bubbles */}
              <div className="w-full max-w-md space-y-3">
                <button
                  onClick={() => {
                    setInput(t('onboarding.sampleQuestions.weather'))
                  }}
                  className="w-full rounded-lg border-2 border-blue-100 bg-blue-50 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌤️</span>
                    <span className="font-medium text-gray-800">
                      {t('onboarding.sampleQuestions.weather')}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setInput(t('onboarding.sampleQuestions.restaurant'))
                  }}
                  className="w-full rounded-lg border-2 border-blue-100 bg-blue-50 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍜</span>
                    <span className="font-medium text-gray-800">
                      {t('onboarding.sampleQuestions.restaurant')}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setInput(t('onboarding.sampleQuestions.activity'))
                  }}
                  className="w-full rounded-lg border-2 border-blue-100 bg-blue-50 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏖️</span>
                    <span className="font-medium text-gray-800">
                      {t('onboarding.sampleQuestions.activity')}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderType === 'USER' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.senderType === 'USER'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  <MessageContent
                    content={message.content}
                    isUser={message.senderType === 'USER'}
                  />
                </div>
              </div>
            ))
          )}
          {sendMessage.isPending && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-blue-600 px-4 py-3 text-white">
                <p className="text-sm">{input}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              disabled={sendMessage.isPending}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || sendMessage.isPending}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
            >
              {sendMessage.isPending ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              ) : (
                tc('send')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
