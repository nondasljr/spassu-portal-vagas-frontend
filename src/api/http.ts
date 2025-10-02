import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import useAuthStore from '../store/auth'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const http = axios.create({ baseURL: API_BASE })

// evita múltiplos refresh simultâneos
let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

function onRefreshed(newToken: string | null) {
  pendingQueue.forEach(cb => cb(newToken))
  pendingQueue = []
}

http.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { response, config } = error
    const original = config as AxiosRequestConfig & { _retry?: boolean }

    // se 401 e temos refreshToken → tenta renovar uma vez
    if (response?.status === 401 && !original._retry) {
      original._retry = true
      const store = useAuthStore.getState()

      // se não há refresh, desloga
      if (!store.refreshToken) {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }

      // fila de requisições enquanto refresh ocorre
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((newToken) => {
            if (!newToken) return reject(error)
            original.headers = original.headers || {}
            original.headers.Authorization = `Bearer ${newToken}`
            resolve(http(original))
          })
        })
      }

      isRefreshing = true
      try {
        const res = await axios.post(`${API_BASE}/api/token/refresh/`, { refresh: store.refreshToken })
        const newAccess = (res.data as any).access as string
        useAuthStore.getState().setTokens(newAccess, store.refreshToken)
        isRefreshing = false
        onRefreshed(newAccess)

        original.headers = original.headers || {}
        original.headers.Authorization = `Bearer ${newAccess}`
        return http(original)
      } catch (e) {
        isRefreshing = false
        onRefreshed(null)
        // refresh inválido → desloga
        useAuthStore.getState().logout()
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  }
)

export default http