import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api'
import { setAccessToken } from '@/lib/api'

interface AuthState {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
}

interface AuthActions {
  setAuth: (accessToken: string, user: User) => void
  setUser: (user: User) => void
  logout: () => void
  clearAuth: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (accessToken: string, user: User) => {
        setAccessToken(accessToken)
        set({
          accessToken,
          user,
          isAuthenticated: true,
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      logout: () => {
        setAccessToken(null)
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        })
      },

      clearAuth: () => {
        setAccessToken(null)
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken)
        }
      },
    }
  )
)
