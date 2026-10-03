import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // Sends the httpOnly auth cookie with every request. The token is never
  // readable from JavaScript, so nothing here has to attach it by hand.
  withCredentials: true,
})

// A 401 means the session cookie is missing, invalid or expired — re-login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/auth/')

    if (error.response?.status === 401 && !isAuthRequest) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
