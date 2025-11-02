export interface ApiResponse<T> {
  msg: string
  data: T
}

export type UserRole = 'USER' | 'GUIDE' | 'ADMIN' | 'PENDING'

export interface User {
  id: number
  email: string
  nickname: string
  profileImageUrl: string | null
  role: UserRole
  location?: string // GUIDE only
  description?: string // GUIDE only
}

// AI Chat
export interface AiChatSession {
  sessionId: number
  sessionTitle: string
}

export type AiMessageSender = 'USER' | 'AI'

export interface AiChatMessage {
  content: string
  senderType: AiMessageSender
}

export interface AiChatMessageResponse {
  userMessage: string
  aiMessage: string
}

// User Chat
export interface ChatRoom {
  id: number
  title: string
  displayTitle: string
  guideId: number
  userId: number
  updatedAt: string
  lastMessageId: number | null
}

export interface ChatRoomListResponse {
  rooms: ChatRoom[]
  nextCursor: string | null
}

export interface ChatMessage {
  id: number
  roomId: number
  senderId: number
  content: string
  createdAt: string
}

// Guide
export interface Guide {
  id: number
  email: string
  nickname: string
  profileImageUrl: string | null
  role: UserRole
  location: string | null
  description: string | null
}
