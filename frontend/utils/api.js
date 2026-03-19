import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
})

// 🔐 Attach NextAuth session to every request
api.interceptors.request.use(async (config) => {
  const session = await getSession()

  if (session?.user?.id) {
    config.headers['x-user-id'] = session.user.id
  }

  return config
})

export default api
