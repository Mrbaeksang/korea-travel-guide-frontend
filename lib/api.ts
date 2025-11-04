import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import type { ApiResponse } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // refreshToken 쿠키 전송을 위해 필요
})

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const getAccessToken = () => {
  return accessToken
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const refreshAuthLogic = async (failedRequest: AxiosError) => {
  try {
    const response = await axios.post<ApiResponse<{ accessToken: string }>>(
      `${API_URL}/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    )

    const newAccessToken = response.data.data.accessToken
    setAccessToken(newAccessToken)

    // Update Zustand store to persist new token in localStorage
    if (typeof window !== 'undefined') {
      const { useAuthStore } = await import('@/stores/use-auth-store')
      const currentState = useAuthStore.getState()
      if (currentState.user) {
        useAuthStore.getState().setAuth(newAccessToken, currentState.user)
      }
    }

    // Fix: Use failedRequest.config instead of failedRequest.response.config
    if (failedRequest.config && failedRequest.config.headers) {
      failedRequest.config.headers.Authorization = `Bearer ${newAccessToken}`
    }

    return Promise.resolve()
  } catch (error) {
    // Clear both in-memory and persisted auth state
    setAccessToken(null)

    // Import dynamically to avoid circular dependency
    if (typeof window !== 'undefined') {
      const { useAuthStore } = await import('@/stores/use-auth-store')
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
}

createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
})

export default api
