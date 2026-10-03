'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { RoadmapDetailsStore } from '@/store/RoadmapDetailsStore'

const AuthContext = createContext(null)

// status: 'loading' | 'authenticated' | 'unauthenticated'
export function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  // The session cookie is httpOnly, so asking the server is the only way to
  // find out whether we are logged in.
  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user)
        setStatus('authenticated')
      })
      .catch(() => {
        setStatus('unauthenticated')
      })
  }, [])

  // The browser stored the cookie from the response itself; only the user
  // object needs handling here.
  const handleAuthSuccess = (data) => {
    setUser(data.user)
    setStatus('authenticated')
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    handleAuthSuccess(res.data)
  }

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password })
    handleAuthSuccess(res.data)
  }

  // `credential` is the ID token Google gave the browser. The backend verifies
  // it, sets the same session cookie and returns the same { user } shape as
  // email/password login.
  const loginWithGoogle = async (credential) => {
    const res = await api.post('/auth/google', { credential })
    handleAuthSuccess(res.data)
  }

  // Only the server can expire an httpOnly cookie. Log out locally either way,
  // so a failed request can't strand the user in a logged-in-looking UI.
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
      setStatus('unauthenticated')
      // Cached roadmap progress belongs to the user who just logged out
      RoadmapDetailsStore.setState({ roadmapData: {}, loading: false })
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, status, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
