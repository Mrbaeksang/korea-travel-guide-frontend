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

    if (failedRequest.response) {
      failedRequest.response.config.headers.Authorization = `Bearer ${newAccessToken}`
    }

    return Promise.resolve()
  } catch (error) {
    setAccessToken(null)

    if (typeof window !== 'undefined') {
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
