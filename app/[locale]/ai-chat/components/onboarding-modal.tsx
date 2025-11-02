'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface OnboardingModalProps {
  onClose: () => void
  onSampleQuestionClick: (question: string) => void
}

export function OnboardingModal({ onClose, onSampleQuestionClick }: OnboardingModalProps) {
  const t = useTranslations('aiChat.onboarding')

  const sampleQuestions = [
    {
      emoji: '🌤️',
      text: t('sampleQuestions.weather'),
    },
    {
      emoji: '🍜',
      text: t('sampleQuestions.restaurant'),
    },
    {
      emoji: '🏖️',
      text: t('sampleQuestions.activity'),
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          {/* Welcome Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <span className="text-3xl">👋</span>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {t('title')}
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-gray-600">
            {t('subtitle')}
          </p>

          {/* Sample Questions */}
          <div className="mb-6 space-y-3">
            <p className="text-sm font-medium text-gray-700">{t('tryAsking')}</p>
            {sampleQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => {
                  onSampleQuestionClick(q.text)
                  onClose()
                }}
                className="w-full rounded-lg border-2 border-blue-100 bg-blue-50 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{q.emoji}</span>
                  <span className="font-medium text-gray-800">{q.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {t('startButton')}
          </button>
        </div>
      </div>
    </>
  )
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('ai-chat-onboarding-seen')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const closeOnboarding = () => {
    localStorage.setItem('ai-chat-onboarding-seen', 'true')
    setShowOnboarding(false)
  }

  return { showOnboarding, closeOnboarding }
}
