import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { ApiResponse, User } from '@/types/api'
import { useAuthStore } from '@/stores/use-auth-store'

// FRONTEND_API.md Section 2.1: 내 정보 조회
export function useUser() {
  const { isAuthenticated, setUser } = useAuthStore()

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>('/api/users/me')
      setUser(data.data)
      return data.data
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

// FRONTEND_API.md Section 2.2: 내 정보 수정
export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (userData: { nickname?: string; profileImageUrl?: string }) => {
      const { data } = await api.patch<ApiResponse<User>>('/api/users/me', userData)
      return data.data
    },
    onSuccess: (updatedUser) => {
      // Update Zustand store
      setUser(updatedUser)
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      toast.success('프로필이 업데이트되었습니다.')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg || '프로필 업데이트에 실패했습니다.')
    },
  })
}

// FRONTEND_API.md Section 2.3: 회원 탈퇴
export function useDeleteAccount() {
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      await api.delete('/api/users/me')
    },
    onSuccess: () => {
      logout()
      toast.success('회원 탈퇴가 완료되었습니다.')
      // Redirect will be handled by the component
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg || '회원 탈퇴에 실패했습니다.')
    },
  })
}
