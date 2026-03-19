'use client'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, Circle, Lock } from 'lucide-react'
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
  const baseClasses = 'w-4 h-4 sm:w-5 sm:h-5'
  const isClickable = typeof onClick === 'function'

  const iconProps = {
    className: `${baseClasses} ${isClickable ? 'cursor-pointer' : ''}`,
    onClick,
  }

  switch (safeStatus) {
    case 'completed':
      return <CheckCircle {...iconProps} className={`${baseClasses} text-green-500`} />
    case 'in_progress':
      return <Clock {...iconProps} className={`${baseClasses} text-blue-500`} />
    case 'not_started':
      return <Circle {...iconProps} className={`${baseClasses} text-indigo-500`} />
    case 'locked':
      return <Lock className={`${baseClasses} text-gray-400`} />
    default:
      return <Circle {...iconProps} className={`${baseClasses} text-gray-300`} />
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
    <Badge
      className={`
        ${variants[safeStatus]}
        text-[9px] sm:text-[10px] md:text-xs
        py-0.5 px-1 sm:py-0.5 sm:px-1.5 md:py-1 md:px-2
        rounded-md
      `}
    >
      {formattedStatus}
    </Badge>
  )
}

/* ---------------------------------------------------
   Milestone Card
--------------------------------------------------- */
export default function MilestoneCard({ milestone, index, onComplete, onOpen }) {
  const safeStatus = normalizeStatus(milestone.status)
  const router = useRouter()


  const handleNavigate = () => {
    if (safeStatus === 'locked') return
    router.push(`/resource/milestone/${milestone._id}`)
  }


  return (
    <div onClick={handleNavigate} className="cursor-pointer">
    <Card
      className={`transition-all duration-200 hover:shadow-md ${safeStatus === 'locked' ? 'opacity-60' : 'cursor-pointer'
        } p-2 sm:p-3 md:p-3`}
      // onClick={() => {
      //   if (safeStatus !== 'locked' && onOpen) {
      //     router.push(`/resource/milestone/${milestone._id}`)
      //   }
      // }}
    >
      <CardHeader className="p-0">
        <div className="flex flex-row sm:items-start gap-2 sm:gap-3">

          {/* Status Icon */}
          <div className="flex-shrink-0 flex items-center">
            <StatusIcon
              status={safeStatus}
              onClick={(e) => {
                e.stopPropagation()
                if (safeStatus === 'locked') return
                onComplete()
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 sm:mb-2">
              <div>
                <CardTitle className="text-sm sm:text-base md:text-base mb-0.5">
                  {index + 1}. {milestone.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-sm text-gray-600">
                  {milestone.description}
                </CardDescription>
              </div>
              <div className="mt-1 sm:mt-0">
                <StatusBadge status={safeStatus} />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {milestone.duration}
              </div>
            </div>

            {/* Progress */}
            {safeStatus === 'in_progress' && milestone.progress != null && (
              <div className="mt-1 sm:mt-2">
                <div className="flex justify-between mb-1 text-xs sm:text-sm">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-1.5 sm:h-2" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
    </div>
  )
}
