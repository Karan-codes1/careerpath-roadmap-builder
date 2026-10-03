'use client'

import { Clock, CheckCircle, Circle, Lock, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

/* ---------------------------------------------------
   🔒 Normalize status so UI NEVER sees invalid states
--------------------------------------------------- */
const normalizeStatus = (status) => {
  if (!status) return 'not_started'
  if (status === 'pending') return 'not_started'
  if (status === 'not started') return 'not_started'
  return status
}

/* ---------------------------------------------------
   Status Icon
--------------------------------------------------- */
export function StatusIcon({ status, onClick }) {
  const safeStatus = normalizeStatus(status)
  const isClickable = typeof onClick === 'function'
  const baseClasses = `w-5 h-5 sm:w-6 sm:h-6 ${isClickable ? 'cursor-pointer' : ''}`

  switch (safeStatus) {
    case 'completed':
      return <CheckCircle onClick={onClick} className={`${baseClasses} text-green-500`} />
    case 'in_progress':
      return <Clock onClick={onClick} className={`${baseClasses} text-blue-500`} />
    case 'not_started':
      return <Circle onClick={onClick} className={`${baseClasses} text-indigo-500`} />
    case 'locked':
      return <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
    default:
      return <Circle onClick={onClick} className={`${baseClasses} text-gray-300`} />
  }
}

/* ---------------------------------------------------
   Status Badge
--------------------------------------------------- */
export function StatusBadge({ status }) {
  const safeStatus = normalizeStatus(status)

  const variants = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    locked: 'bg-gray-100 text-gray-500',
    not_started: 'bg-indigo-100 text-indigo-700',
  }

  const formattedStatus =
    safeStatus === 'in_progress'
      ? 'In Progress'
      : safeStatus === 'not_started'
        ? 'Start Now'
        : safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)

  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-medium sm:text-xs ${variants[safeStatus] || 'bg-gray-100 text-gray-500'}`}
    >
      {formattedStatus}
    </span>
  )
}

/* ---------------------------------------------------
   Milestone Card
--------------------------------------------------- */
export default function MilestoneCard({ milestone, index, onComplete, onOpen }) {
  const safeStatus = normalizeStatus(milestone.status)
  const router = useRouter()

  const isLocked = safeStatus === 'locked'
  const isCompleted = safeStatus === 'completed'

  const handleNavigate = () => {
    if (isLocked) return
    router.push(`/resource/milestone/${milestone._id}`)
  }

  return (
    <div
      onClick={handleNavigate}
      className={`group rounded-xl border p-3 shadow-sm transition-all duration-200 sm:p-4 ${
        isLocked
          ? 'cursor-not-allowed border-gray-200 bg-white opacity-60'
          : isCompleted
            ? 'cursor-pointer border-green-200 bg-green-50/50 hover:shadow-md'
            : 'cursor-pointer border-gray-200 bg-white hover:border-[#339999]/60 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">

        {/* Status toggle */}
        <button
          type="button"
          disabled={isLocked}
          onClick={(e) => {
            e.stopPropagation()
            if (isLocked) return
            onComplete()
          }}
          title={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
          aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
          className="mt-0.5 flex-shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100 disabled:hover:bg-transparent"
        >
          <StatusIcon status={safeStatus} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-sm font-semibold sm:text-base ${
                isCompleted ? 'text-gray-700' : 'text-gray-900'
              }`}
            >
              {index + 1}. {milestone.title}
            </h3>
            <StatusBadge status={safeStatus} />
          </div>

          <p className="mt-1 text-xs text-gray-600 sm:text-sm">
            {milestone.description}
          </p>

          {/* Details */}
          {milestone.duration && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {milestone.duration}
            </div>
          )}

          {/* Progress */}
          {safeStatus === 'in_progress' && milestone.progress != null && (
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs sm:text-sm">
                <span>Progress</span>
                <span>{milestone.progress}%</span>
              </div>
              <Progress
                value={milestone.progress}
                className="h-1.5 sm:h-2"
                indicatorClassName="bg-[#339999]"
              />
            </div>
          )}
        </div>

        {!isLocked && (
          <ChevronRight className="hidden h-5 w-5 flex-shrink-0 self-center text-gray-300 transition-colors group-hover:text-[#339999] sm:block" />
        )}
      </div>
    </div>
  )
}
