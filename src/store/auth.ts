import { create } from 'zustand'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

// chaves no localStorage
const LS_ACCESS = 'auth_access'
const LS_REFRESH = 'auth_refresh'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setTokens: (access: string | null, refresh: string | null) => void
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem(LS_ACCESS),
  refreshToken: localStorage.getItem(LS_REFRESH),
  isAuthenticated: !!localStorage.getItem(LS_ACCESS),
  async login(username, password) {
    const res = await axios.post(`${API_BASE}/api/token/`, { username, password })
    const { access, refresh } = res.data
    localStorage.setItem(LS_ACCESS, access)
    localStorage.setItem(LS_REFRESH, refresh)
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true })
  },
  logout() {
    localStorage.removeItem(LS_ACCESS)
    localStorage.removeItem(LS_REFRESH)
    set({ accessToken: null, refreshToken: null, isAuthenticated: false })
  },
  setTokens(access, refresh) {
    if (access) localStorage.setItem(LS_ACCESS, access); else localStorage.removeItem(LS_ACCESS)
    if (refresh) localStorage.setItem(LS_REFRESH, refresh); else localStorage.removeItem(LS_REFRESH)
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: !!access })
  }
}))

export default useAuthStore