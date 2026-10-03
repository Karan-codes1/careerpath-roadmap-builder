// app/profile/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, status } = useAuth()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/profile')
    }
  }, [status, router])

  if (status !== 'authenticated') return null

  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">Profile Page</h1>
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#339999] text-xl font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome back, {user?.name}!</p>
            <p className="truncate text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
