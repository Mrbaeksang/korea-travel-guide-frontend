'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/use-auth-store'
import { useChatRoom, useChatMessages } from '@/hooks/use-user-chat'
import type { ChatMessage } from '@/types/api'
import { getAccessToken } from '@/lib/api'

export default function ChatRoomPage() {
  const t = useTranslations('chat')
  const tCommon = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const roomId = Number(params.roomId)

  const { data: room, isLoading: isRoomLoading } = useChatRoom(roomId)
  const { data: messages, isLoading: isMessagesLoading } = useChatMessages(roomId)

  const [inputMessage, setInputMessage] = useState('')
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef(0)

  // Auto-scroll to bottom ONLY when new messages are added
  useEffect(() => {
    // Only scroll if messages were added (not on initial load or room change)
    if (liveMessages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevMessageCountRef.current = liveMessages.length
  }, [liveMessages])

  // Reset counter when room changes
  useEffect(() => {
    prevMessageCountRef.current = 0
  }, [roomId])

  // Initialize messages from API
  useEffect(() => {
    if (messages) {
      setLiveMessages(messages)
    }
  }, [messages])

  // WebSocket connection setup
  useEffect(() => {
    console.log('[DEBUG] WebSocket useEffect triggered', { roomId, user, hasToken: !!getAccessToken() })

    if (!roomId || !user) {
      console.warn('[DEBUG] WebSocket connection blocked:', { roomId, user })
      return
    }

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws/userchat'
    const token = getAccessToken()

    console.log('[DEBUG] Connecting to WebSocket:', WS_URL, 'with token:', !!token)

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      debug: (str) => {
        console.log('[STOMP]', str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[WebSocket] Connected to room:', roomId)
        setIsConnected(true)

        // Subscribe to room topic - FRONTEND_API.md Section 5.2
        client.subscribe(`/topic/userchat/${roomId}`, (message) => {
          const newMessage: ChatMessage = JSON.parse(message.body)
          console.log('[WebSocket] Received message:', newMessage)

          setLiveMessages((prev) => [...prev, newMessage])
        })
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame.headers['message'])
        console.error('[WebSocket] Details:', frame.body)
        setIsConnected(false)
        toast.error(t('connectionError'))
      },
      onWebSocketClose: () => {
        console.log('[WebSocket] Disconnected')
        setIsConnected(false)
      },
    })

    client.activate()
    setStompClient(client)

    return () => {
      if (client.active) {
        client.deactivate()
      }
    }
  }, [roomId, user])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    if (!stompClient || !isConnected) {
      toast.error(t('notConnected'))
      return
    }

    const messagePayload = {
      content: inputMessage.trim(),
    }

    try {
      // FRONTEND_API.md Section 5.3: Publish message
      stompClient.publish({
        destination: `/pub/userchat/${roomId}/messages`,
        body: JSON.stringify(messagePayload),
      })

      setInputMessage('')
    } catch (error) {
      console.error('[WebSocket] Send error:', error)
      toast.error(t('sendError'))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isRoomLoading || isMessagesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('notFound')}</h2>
          <button
            onClick={() => router.push('/chat')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t('backToList')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {room.displayTitle}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></div>
                <span>{isConnected ? t('connected') : t('connecting')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
        <div className="space-y-4">
          {liveMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">{t('startConversation')}</p>
            </div>
          ) : (
            liveMessages.map((message) => {
              const isMyMessage = message.senderId === user?.id

              return (
                <div
                  key={message.id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isMyMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        isMyMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('inputPlaceholder')}
            disabled={!isConnected}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {tCommon('send')}
          </button>
        </div>
      </div>
    </div>
  )
}
