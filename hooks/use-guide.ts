import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, Guide } from '@/types/api'

// 가이드 목록 조회
export function useGuides() {
  return useQuery({
    queryKey: ['guides'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Guide[]>>('/api/guides')
      return data.data
    },
  })
}

// 가이드 단건 조회
export function useGuide(guideId: number | null) {
  return useQuery({
    queryKey: ['guides', guideId],
    queryFn: async () => {
      if (!guideId) return null
      const { data } = await api.get<ApiResponse<Guide>>(`/api/guides/${guideId}`)
      return data.data
    },
    enabled: !!guideId,
  })
}
