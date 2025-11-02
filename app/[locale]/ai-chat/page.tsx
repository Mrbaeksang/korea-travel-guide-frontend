'use client'

import { useState } from 'react'
import { SessionList } from './components/session-list'
import { ChatArea } from './components/chat-area'
import { OnboardingModal, useOnboarding } from './components/onboarding-modal'

export default function AiChatPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { showOnboarding, closeOnboarding } = useOnboarding()

  return (
    <div className="relative flex h-[calc(100vh-64px)]">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 top-20 z-50 rounded-lg bg-blue-600 p-2 text-white shadow-lg md:hidden"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Session List */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SessionList
          selectedSessionId={selectedSessionId}
          onSelectSession={(id) => {
            setSelectedSessionId(id)
            setIsSidebarOpen(false) // Close sidebar on mobile after selection
          }}
        />
      </div>

      {/* Right Area - Chat */}
      <ChatArea
        sessionId={selectedSessionId}
        onSampleQuestionClick={(question) => {
          // Will be implemented: auto-fill input with sample question
          console.log('Sample question clicked:', question)
        }}
      />

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          onClose={closeOnboarding}
          onSampleQuestionClick={(question) => {
            console.log('Sample question clicked:', question)
            // Will be implemented: auto-fill input with sample question
          }}
        />
      )}
    </div>
  )
}
