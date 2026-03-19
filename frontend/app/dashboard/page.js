'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'

export default function DashboardPage() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await api.get('/dashboard')
        setMessage(res.data.message)
      } catch (error) {
        console.error(error)
        setMessage('Error fetching dashboard message')
      }
    }

    fetchMessage()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">{message}</p>
    </main>
  )
}
