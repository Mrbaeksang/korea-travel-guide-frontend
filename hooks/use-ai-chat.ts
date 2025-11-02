import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type {
  ApiResponse,
  AiChatSession,
  AiChatMessage,
  AiChatMessageResponse,
} from '@/types/api'

// FRONTEND_API.md Section 3.1: 세션 목록 조회
export function useAiChatSessions() {
  return useQuery({
    queryKey: ['ai-chat', 'sessions'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AiChatSession[]>>(
        '/api/aichat/sessions'
      )
      return data.data
    },
  })
}

// FRONTEND_API.md Section 3.2: 새 세션 생성
export function useCreateAiChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<AiChatSession>>(
        '/api/aichat/sessions'
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat', 'sessions'] })
      toast.success('새 세션이 생성되었습니다.')
    },
    onError: () => {
      toast.error('세션 생성에 실패했습니다.')
    },
  })
}

// FRONTEND_API.md Section 3.3: 세션 삭제
export function useDeleteAiChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: number) => {
      await api.delete(`/api/aichat/sessions/${sessionId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat', 'sessions'] })
      toast.success('세션이 삭제되었습니다.')
    },
    onError: () => {
      toast.error('세션 삭제에 실패했습니다.')
    },
  })
}

// FRONTEND_API.md Section 3.4: 세션 메시지 조회
export function useAiChatMessages(sessionId: number | null) {
  return useQuery({
    queryKey: ['ai-chat', 'sessions', sessionId, 'messages'],
    queryFn: async () => {
      if (!sessionId) return []
      const { data } = await api.get<ApiResponse<AiChatMessage[]>>(
        `/api/aichat/sessions/${sessionId}/messages`
      )
      return data.data
    },
    enabled: !!sessionId,
  })
}

// FRONTEND_API.md Section 3.5: 메시지 전송 (AI와 대화)
export function useSendAiChatMessage(sessionId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userMessage: string) => {
      if (!sessionId) throw new Error('세션을 선택해주세요')

      const { data } = await api.post<ApiResponse<AiChatMessageResponse>>(
        `/api/aichat/sessions/${sessionId}/messages`,
        { message: userMessage }
      )
      return data.data
    },
    onSuccess: () => {
      // 메시지 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['ai-chat', 'sessions', sessionId, 'messages'],
      })
      // 세션 목록도 갱신 (제목이 자동으로 업데이트될 수 있도록)
      queryClient.invalidateQueries({
        queryKey: ['ai-chat', 'sessions'],
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg || '메시지 전송에 실패했습니다.')
    },
  })
}

// FRONTEND_API.md Section 3.6: 세션 제목 수정
export function useUpdateAiChatSessionTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      newTitle,
    }: {
      sessionId: number
      newTitle: string
    }) => {
      await api.patch(`/api/aichat/sessions/${sessionId}/title`, { newTitle })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat', 'sessions'] })
      toast.success('세션 제목이 수정되었습니다.')
    },
    onError: () => {
      toast.error('제목 수정에 실패했습니다.')
    },
  })
}
