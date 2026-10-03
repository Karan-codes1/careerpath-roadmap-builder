'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const router = useRouter()
  const { status } = useAuth()
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/dashboard')
      return
    }

    if (status !== 'authenticated') return

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
  }, [status, router])

  if (status !== 'authenticated') return null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">Dashboard</h1>
        <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">{message}</p>
        </div>
      </div>
    </main>
  )
}
