"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import api from "@/utils/api"
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  FileText,
  GraduationCap,
  Lightbulb,
  MinusCircle,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  Video,
  XCircle,
} from "lucide-react"

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"]

const STATUS = {
  correct: {
    label: "Correct",
    icon: CheckCircle,
    pill: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    number: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  },
  incorrect: {
    label: "Incorrect",
    icon: XCircle,
    pill: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
    number: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
  },
  skipped: {
    label: "Skipped",
    icon: MinusCircle,
    pill: "border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    number: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  },
}

const RESOURCE_ICONS = {
  video: Video,
  article: FileText,
  book: BookOpen,
  course: GraduationCap,
}

/* ---------------------------------------------------
   Score ring shown in the summary banner
--------------------------------------------------- */
function ScoreRing({ percent }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="9"
          className="stroke-white/25"
        />
        {percent > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            className="stroke-white"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent / 100)}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-bold leading-none sm:text-3xl">{percent}%</span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/80">
          Score
        </span>
      </div>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-2 text-center sm:px-4">
      <div className="text-lg font-bold leading-tight sm:text-xl">{value}</div>
      <div className="text-[11px] text-white/85 sm:text-xs">{label}</div>
    </div>
  )
}

/* ---------------------------------------------------
   One reviewed question
--------------------------------------------------- */
function QuestionReview({ question, number, userAnswer, status, aiExplanation, aiLoading, onExplain }) {
  const meta = STATUS[status]
  const StatusIcon = meta.icon

  return (
    <article className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${meta.number}`}
        >
          {number}
        </span>
        <p className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">
          {question.question}
        </p>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.pill}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5 sm:pl-10">
        {question.options.map((option, i) => {
          const isCorrectOption = i === question.correctIndex
          const isChosen = i === userAnswer

          let rowStyle = "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400"
          if (isCorrectOption) rowStyle = "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
          else if (isChosen) rowStyle = "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"

          return (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${rowStyle}`}
            >
              <span className="w-4 shrink-0 text-xs font-semibold">
                {OPTION_LABELS[i] || i + 1}
              </span>
              <span className="min-w-0 flex-1 break-words">{option}</span>
              {isCorrectOption && (
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {isChosen ? "Your answer" : "Correct answer"}
                </span>
              )}
              {isChosen && !isCorrectOption && (
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                  <XCircle className="h-3.5 w-3.5" />
                  Your answer
                </span>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-3 space-y-2 sm:pl-10">
        {question.explanation && (
          <p className="rounded-lg border-l-4 border-[#339999] bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-[#267373] dark:text-[#5fc9c9]">Explanation: </span>
            {question.explanation}
          </p>
        )}

        {aiExplanation && (
          <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-sm text-blue-800 dark:text-blue-300">
            <span className="mb-1 flex items-center gap-1.5 font-semibold">
              <Sparkles className="h-4 w-4" />
              AI explanation
            </span>
            <p className="whitespace-pre-line">{aiExplanation}</p>
          </div>
        )}

        <button
          type="button"
          disabled={aiLoading}
          onClick={onExplain}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#339999] px-3 py-1.5 text-sm font-medium text-[#267373] dark:text-[#5fc9c9] transition-colors hover:bg-[#339999] hover:text-white disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-[#267373] dark:disabled:hover:text-[#5fc9c9]"
        >
          <Lightbulb className="h-4 w-4" />
          {aiLoading ? "Generating..." : aiExplanation ? "Explain again" : "Explain with AI"}
        </button>
      </div>
    </article>
  )
}

/* ---------------------------------------------------
   Quiz results page
--------------------------------------------------- */
export default function QuizResults({ score, total, answers, questions, onRestart, title, roadmapId }) {
  const [aiExplanations, setAiExplanations] = useState({})
  const [loading, setLoading] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(true)
  const [recsFailed, setRecsFailed] = useState(false)
  const [filter, setFilter] = useState("all")

  // The results never change while this screen is open, so one request is enough
  const requestedRecs = useRef(false)

  const reviewed = questions.map((q, index) => {
    const answer = answers.find(a => a.questionId === q._id)
    const userAnswer = answer ? answer.selected : null
    const status =
      userAnswer === null ? "skipped" : userAnswer === q.correctIndex ? "correct" : "incorrect"

    return { question: q, number: index + 1, userAnswer, status }
  })

  const counts = {
    all: reviewed.length,
    correct: reviewed.filter(r => r.status === "correct").length,
    incorrect: reviewed.filter(r => r.status === "incorrect").length,
    skipped: reviewed.filter(r => r.status === "skipped").length,
  }

  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const visible = filter === "all" ? reviewed : reviewed.filter(r => r.status === filter)

  const message =
    score === total
      ? "Perfect score! Outstanding work."
      : score > total * 0.5
        ? "Great job! Keep the momentum going."
        : "Review the answers below and try again."

  const filters = [
    { key: "all", label: "All" },
    { key: "incorrect", label: "Incorrect" },
    { key: "skipped", label: "Skipped" },
    { key: "correct", label: "Correct" },
  ].filter(f => f.key === "all" || counts[f.key] > 0)

  const fetchAIExplanation = async (q, userAnswer) => {
    try {
      setLoading(prev => ({ ...prev, [q._id]: true }))
      const res = await api.post("/ai/explanation", {
        questionId: q._id,
        selectedAnswer: userAnswer,
      })
      setAiExplanations(prev => ({ ...prev, [q._id]: res.data.explanation }))
    } catch (err) {
      const limitMessage = err?.response?.status === 429 ? err.response.data?.message : null
      setAiExplanations(prev => ({
        ...prev,
        [q._id]: limitMessage || "Failed to fetch AI explanation. Please try again.",
      }))
    } finally {
      setLoading(prev => ({ ...prev, [q._id]: false }))
    }
  }

  const fetchRecommendations = async () => {
    try {
      setLoadingRecs(true)
      setRecsFailed(false)
      // Send only opaque references — the backend grades against its own data
      const quizResults = questions.map(q => {
        const ans = answers.find(a => a.questionId === q._id)
        return {
          questionId: q._id,
          userSelectedAnswer: ans ? ans.selected : null,
        }
      })
      const res = await api.post("/ai/recommendations", { quizResults })
      setRecommendations(res.data.recommendations || [])
    } catch (err) {
      console.error("Error fetching recommendations:", err)
      setRecsFailed(true)
    } finally {
      setLoadingRecs(false)
    }
  }

  useEffect(() => {
    if (requestedRecs.current) return
    requestedRecs.current = true
    fetchRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* ---------- Summary banner ---------- */}
      <section className="rounded-2xl bg-[#339999] p-5 text-white shadow-lg sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <ScoreRing percent={percent} />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                Quiz result
              </p>
              <h1 className="text-xl font-semibold leading-snug sm:text-2xl">
                {title || "Your results"}
              </h1>
              <p className="mt-1 text-sm text-white/90">
                You got <span className="font-semibold text-white">{score}</span> of{" "}
                <span className="font-semibold text-white">{total}</span> correct. {message}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="grid grid-cols-3 gap-2">
              <Stat value={counts.correct} label="Correct" />
              <Stat value={counts.incorrect} label="Incorrect" />
              <Stat value={counts.skipped} label="Skipped" />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#267373] transition-colors hover:bg-gray-100 md:flex-none"
              >
                <RotateCcw className="h-4 w-4" />
                Retake quiz
              </button>
              {roadmapId && (
                <Link
                  href={`/roadmap/${roadmapId}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 md:flex-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to roadmap
                </Link>
              )}
            </div>
          </div>
        </div>

        <a
          href="#recommended-resources"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white underline underline-offset-4 lg:hidden"
        >
          <BookOpen className="h-4 w-4" />
          See recommended resources
        </a>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ---------- Answer review ---------- */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Review your answers</h2>

            <div className="flex flex-wrap gap-2">
              {filters.map(f => {
                const isActive = filter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm ${
                      isActive
                        ? "border-[#339999] bg-[#339999] text-white"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {f.label}
                    <span className={`ml-1.5 ${isActive ? "text-white/80" : "text-gray-400 dark:text-gray-500"}`}>
                      {counts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            {visible.map(item => (
              <QuestionReview
                key={item.question._id}
                question={item.question}
                number={item.number}
                userAnswer={item.userAnswer}
                status={item.status}
                aiExplanation={aiExplanations[item.question._id]}
                aiLoading={!!loading[item.question._id]}
                onExplain={() => fetchAIExplanation(item.question, item.userAnswer)}
              />
            ))}
          </div>

          <div className="flex justify-center pt-2 lg:justify-start">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-800 dark:bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 dark:hover:bg-gray-600"
            >
              <RotateCcw className="h-4 w-4" />
              Retake quiz
            </button>
          </div>
        </section>

        {/* ---------- Recommended resources ---------- */}
        <aside id="recommended-resources" className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="border-b border-gray-100 dark:border-gray-800 p-4 sm:p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-[#267373] dark:text-[#5fc9c9] sm:text-lg">
                <BookOpen className="h-5 w-5" />
                Recommended for you
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Learning resources picked from the questions you missed.
              </p>
            </div>

            <div className="p-3 sm:p-4 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
              {loadingRecs ? (
                <div className="space-y-3">
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">Analyzing your answers...</p>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-800 p-3">
                      <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-2">
                  {recommendations.map((r, i) => {
                    const ResourceIcon = RESOURCE_ICONS[r.type] || BookOpen
                    return (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-colors hover:border-[#339999] hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#339999]/10 text-[#267373] dark:text-[#5fc9c9]">
                          <ResourceIcon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#267373] dark:group-hover:text-[#5fc9c9]">
                            {r.title}
                          </span>
                          <span className="mt-0.5 block text-xs capitalize text-gray-500 dark:text-gray-400">{r.type}</span>
                        </span>
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-[#339999]" />
                      </a>
                    )
                  })}
                </div>
              ) : recsFailed ? (
                <div className="px-2 py-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Couldn&apos;t load recommendations.</p>
                  <button
                    type="button"
                    onClick={fetchRecommendations}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#339999] px-3 py-1.5 text-sm font-medium text-[#267373] dark:text-[#5fc9c9] transition-colors hover:bg-[#339999] hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                  </button>
                </div>
              ) : score === total ? (
                <div className="px-2 py-6 text-center">
                  <Trophy className="mx-auto h-8 w-8 text-[#339999]" />
                  <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">Nothing to revise</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You got everything right. Move ahead to the next milestone!
                  </p>
                </div>
              ) : (
                <p className="px-2 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No matching resources found for this quiz yet. Use the explanations to review the
                  questions you missed.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
