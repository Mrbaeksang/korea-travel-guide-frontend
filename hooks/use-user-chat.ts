import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type {
  ApiResponse,
  ChatRoom,
  ChatRoomListResponse,
  ChatMessage,
} from '@/types/api'

// FRONTEND_API.md Section 4.1: 채팅방 목록 조회 (페이지네이션)
export function useChatRooms() {
  return useInfiniteQuery({
    queryKey: ['user-chat', 'rooms'],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()
      params.append('limit', '20')
      if (pageParam) {
        params.append('cursor', pageParam)
      }

      const { data } = await api.get<ApiResponse<ChatRoomListResponse>>(
        `/api/userchat/rooms?${params}`
      )
      return data.data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  })
}

// FRONTEND_API.md Section 4.2: 채팅방 생성/재사용
export function useCreateChatRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ guideId, userId }: { guideId: number; userId: number }) => {
      const { data } = await api.post<ApiResponse<ChatRoom>>(
        '/api/userchat/rooms/start',
        { guideId, userId }
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-chat', 'rooms'] })
    },
    onError: () => {
      toast.error('채팅방 생성에 실패했습니다.')
    },
  })
}

// FRONTEND_API.md Section 4.3: 채팅방 상세 조회
export function useChatRoom(roomId: number | null) {
  return useQuery({
    queryKey: ['user-chat', 'rooms', roomId],
    queryFn: async () => {
      if (!roomId) return null
      const { data } = await api.get<ApiResponse<ChatRoom>>(
        `/api/userchat/rooms/${roomId}`
      )
      return data.data
    },
    enabled: !!roomId,
  })
}

// FRONTEND_API.md Section 4.4: 채팅방 삭제
export function useDeleteChatRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (roomId: number) => {
      await api.delete(`/api/userchat/rooms/${roomId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-chat', 'rooms'] })
      toast.success('채팅방이 삭제되었습니다.')
    },
    onError: () => {
      toast.error('채팅방 삭제에 실패했습니다.')
    },
  })
}

// FRONTEND_API.md Section 4.5: 메시지 목록 조회
export function useChatMessages(roomId: number | null, after?: number) {
  return useQuery({
    queryKey: ['user-chat', 'rooms', roomId, 'messages', after],
    queryFn: async () => {
      if (!roomId) return []

      const params = new URLSearchParams()
      params.append('limit', '50')
      if (after) {
        params.append('after', after.toString())
      }

      const { data } = await api.get<ApiResponse<ChatMessage[]>>(
        `/api/userchat/rooms/${roomId}/messages?${params}`
      )
      return data.data
    },
    enabled: !!roomId,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  })
}

// FRONTEND_API.md Section 4.6: 메시지 전송 (REST)
export function useSendChatMessage(roomId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      if (!roomId) throw new Error('채팅방을 선택해주세요')

      const { data } = await api.post<ApiResponse<ChatMessage>>(
        `/api/userchat/rooms/${roomId}/messages`,
        { content }
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-chat', 'rooms', roomId, 'messages'],
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg || '메시지 전송에 실패했습니다.')
    },
  })
}
