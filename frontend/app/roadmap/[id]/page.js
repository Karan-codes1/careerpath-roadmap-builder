'use client'
console.log("ROADMAP DETAIL PAGE")

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import api from '@/utils/api'
import { useSession } from 'next-auth/react'
import { Clock, Trophy, Users, CheckCircle, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RoadmapDetailsStore } from '@/store/RoadmapDetailsStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// ✅ Lazy load milestone cards
const MilestoneCard = dynamic(() => import('@/components/MilestoneCard'), {
  loading: () => (
    <div className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
  ),
  ssr: false,
})

export default function RoadmapDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

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
      router.replace('/login')
    }
  }, [status, router])

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
        <Badge
          key={index}
          variant="secondary"
          className="bg-gray-100 rounded-lg text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1"
        >
          {tag}
        </Badge>
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
  if (status === 'loading') return null
  if (status !== 'authenticated') return null

  if (milestonesLoading || !roadmap) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading roadmap...</p>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div>
                  <h1 className="mb-1 sm:mb-2 text-2xl sm:text-4xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text underline underline-offset-4 decoration-[#339999]">
                    {roadmap?.title || 'Loading...'}
                  </h1>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base sm:mb-4">
                    {roadmap?.description || ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">{skillBadges}</div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-blue-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Duration</div>
                  <div className="text-sm sm:text-base">{roadmap?.duration}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-yellow-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Difficulty</div>
                  <div className="text-sm sm:text-base">{roadmap?.difficulty}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-green-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Enrolled</div>
                  <div className="text-sm sm:text-base">{roadmap?.learners?.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-purple-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Success Rate</div>
                  <div className="text-sm sm:text-base">{roadmap?.completionRate}%</div>
                </div>
              </div>

              <button
                onClick={handleGetProjectIdeas}
                className="flex items-center gap-1 sm:gap-2 bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Get Project Ideas
              </button>
            </div>

            {/* Progress Card */}
            <div>
              <Card>
                <CardHeader className="py-3 sm:py-6">
                  <CardTitle className="text-lg sm:text-xl">Your Progress</CardTitle>
                  <CardDescription className="text-sm">
                    {progress === 0
                      ? "Let's get started!"
                      : progress === 100
                        ? 'You’ve completed the roadmap. Great job!'
                        : "Keep going! You're doing great."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 sm:pt-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm">Overall Progress</span>
                        <span className="text-xs sm:text-sm">{progress}%</span>
                      </div>
                      <Progress className="bg-black h-2 sm:h-3" value={progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                      <div>
                        <div className="text-lg sm:text-xl text-green-500">{completedMilestones}</div>
                        <div className="text-xs sm:text-sm text-green-500 font-semibold">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl text-gray-500">{remainingMilestones}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Remaining</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Milestones</h2>
          <Badge variant="outline" className="text-xs sm:text-sm">
            {milestonesLoading ? 'Loading...' : `${milestones.length} steps`}
          </Badge>
        </div>

        {/* Conditional Rendering Logic */}
        {milestonesLoading ? (
          // ✅ Show skeletons when loading
          <div className="space-y-4 sm:space-y-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 sm:h-28 w-full bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : milestones && milestones.length > 0 ? (
          // ✅ Show milestones once loaded
          <div className="space-y-4 sm:space-y-6">{milestoneList}</div>
        ) : (
          // ✅ Show empty state only when loading has finished
          <div className="text-gray-500 text-sm sm:text-base">
            No milestones available for this roadmap yet.
          </div>
        )}
      </div>



      {/* Take the Quiz CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center text-center">
        <p className="text-base sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
          Ready to test your skills? Take the quiz now!
        </p>
        <Link href={`/quiz/${id}`}>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold transition">
            Take the Quiz
          </Button>
        </Link>
      </div>
    </div>
  )
}


