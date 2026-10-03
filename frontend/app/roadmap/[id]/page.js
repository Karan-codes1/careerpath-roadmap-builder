'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import api from '@/utils/api'
import { useAuth } from '@/context/AuthContext'
import { Clock, Trophy, Users, CheckCircle, Sparkles, ArrowRight } from 'lucide-react'
import { RoadmapDetailsStore } from '@/store/RoadmapDetailsStore'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

// ✅ Lazy load milestone cards
const MilestoneCard = dynamic(() => import('@/components/MilestoneCard'), {
  loading: () => (
    <div className="h-24 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
  ),
  ssr: false,
})

export default function RoadmapDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { status } = useAuth()

  // ✅ Zustand store
  const { roadmapData, fetchRoadmapDetails } = RoadmapDetailsStore()
  const cached = roadmapData?.[id]

  const [roadmap, setRoadmap] = useState(cached?.roadmap || null)
  const [milestones, setMilestones] = useState(cached?.milestones || [])
  const [progress, setProgress] = useState(cached?.progress?.progressPercentage || 0)
  const [remainingMilestones, setRemainingMilestones] = useState(cached?.progress?.remainingMilestones || 0)
  const [completedMilestones, setCompletedMilestones] = useState(cached?.progress?.completedMilestones || 0)
  const [milestonesLoading, setMilestonesLoading] = useState(!cached)

  // 1️⃣ Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/roadmap/${id}`)}`)
    }
  }, [status, router, id])

  // 2️⃣ Fetch data only if authenticated
  useEffect(() => {
    if (!id || status !== 'authenticated') return
    setMilestonesLoading(true)
    fetchRoadmapDetails(id)
  }, [id, status, fetchRoadmapDetails])

  // ✅ FIX: moved BEFORE any return
  useEffect(() => {
    if (!cached) return

    setRoadmap(cached.roadmap)
    setMilestones(cached.milestones)
    setProgress(cached.progress?.progressPercentage || 0)
    setRemainingMilestones(cached.progress?.remainingMilestones || 0)
    setCompletedMilestones(cached.progress?.completedMilestones || 0)
    setMilestonesLoading(false)
  }, [cached])

  const handleGetProjectIdeas = () => {
    if (!roadmap?.title) return
    router.push(`/projects?roadmapName=${encodeURIComponent(roadmap.title)}`)
  }

  const handleMilestoneComplete = async (milestoneId) => {
    const updatedMilestones = milestones.map((m) => {
      if (m._id !== milestoneId) return m
      if (m.status === 'locked') return m

      const newStatus =
        m.status === 'completed' ? 'not_started' : 'completed'

      return {
        ...m,
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : 0,
      }
    })

    const total = updatedMilestones.length
    const completed = updatedMilestones.filter(
      (m) => m.status === 'completed'
    ).length

    const newProgress =
      total === 0 ? 0 : Math.round((completed / total) * 100)

    setMilestones(updatedMilestones)
    setProgress(newProgress)
    setCompletedMilestones(completed)
    setRemainingMilestones(total - completed)

    RoadmapDetailsStore.getState().setRoadmapData(id, {
      roadmap,
      milestones: updatedMilestones,
      progress: {
        progressPercentage: newProgress,
        completedMilestones: completed,
        remainingMilestones: total - completed,
      },
    })

    const updatedStatus = updatedMilestones.find(
      (m) => m._id === milestoneId
    )?.status

    await api.put(`/roadmap/${id}`, {
      milestoneId,
      status: updatedStatus,
    })
  }

  const skillBadges = useMemo(
    () =>
      roadmap?.skills?.map((tag, index) => (
        <span
          key={index}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 sm:px-3 sm:py-1 sm:text-sm"
        >
          {tag}
        </span>
      )) || [],
    [roadmap?.skills]
  )

  const milestoneList = useMemo(
    () =>
      milestones.map((milestone, index) => (
        <MilestoneCard
          key={milestone._id}
          milestone={milestone}
          index={index}
          onComplete={() => handleMilestoneComplete(milestone._id)}
        />
      )),
    [milestones]
  )

  // ✅ SINGLE check AFTER hooks
  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  const stats = [
    { label: 'Duration', value: roadmap?.duration, icon: Clock, color: 'text-blue-500 dark:text-blue-400' },
    { label: 'Difficulty', value: roadmap?.difficulty, icon: Trophy, color: 'text-yellow-500 dark:text-yellow-400' },
    { label: 'Enrolled', value: roadmap?.learners?.toLocaleString(), icon: Users, color: 'text-green-500 dark:text-green-400' },
    {
      label: 'Success Rate',
      value: roadmap?.completionRate != null ? `${roadmap.completionRate}%` : undefined,
      icon: CheckCircle,
      color: 'text-purple-500 dark:text-purple-400',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <h1 className="mb-2 text-2xl sm:text-4xl font-extrabold tracking-wide text-[#339999] underline decoration-[#339999]/40 decoration-2 underline-offset-8">
                {roadmap?.title || 'Loading...'}
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                {roadmap?.description || ''}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">{skillBadges}</div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-3 text-center sm:p-4"
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${color}`} />
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{label}</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{value ?? '—'}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGetProjectIdeas}
                className="mt-5 flex items-center gap-2 rounded-lg bg-gray-800 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900 dark:hover:bg-gray-600"
              >
                <Sparkles className="w-4 h-4" />
                Get Project Ideas
              </button>
            </div>

            {/* Progress Card */}
            <div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Your Progress</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {progress === 0
                    ? "Let's get started!"
                    : progress === 100
                      ? 'You’ve completed the roadmap. Great job!'
                      : "Keep going! You're doing great."}
                </p>

                <div className="mt-5">
                  <div className="flex justify-between mb-2 text-xs sm:text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Overall Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{progress}%</span>
                  </div>
                  <Progress
                    className="h-2 sm:h-3"
                    indicatorClassName="bg-[#339999]"
                    value={progress}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/40 py-3">
                    <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{completedMilestones}</div>
                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">Completed</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 py-3">
                    <div className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">{remainingMilestones}</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Milestones</h2>
          <span className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
            {milestonesLoading ? 'Loading...' : `${milestones.length} steps`}
          </span>
        </div>

        {/* Conditional Rendering Logic */}
        {milestonesLoading ? (
          // ✅ Show skeletons when loading
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 sm:h-28 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : milestones && milestones.length > 0 ? (
          // ✅ Show milestones once loaded
          <div className="space-y-3 sm:space-y-4">{milestoneList}</div>
        ) : (
          // ✅ Show empty state only when loading has finished
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-10 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            No milestones available for this roadmap yet.
          </div>
        )}
      </div>



      {/* Take the Quiz CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-8 text-center shadow-sm sm:py-10">
          <p className="text-base sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Ready to test your skills? Take the quiz now!
          </p>
          <Link
            href={`/quiz/${id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-800 dark:bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 dark:hover:bg-gray-600 sm:px-6 sm:py-3 sm:text-lg"
          >
            Take the Quiz
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
