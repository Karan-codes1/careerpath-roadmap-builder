"use client"
import { useEffect, useState, useRef } from "react"
import api from "@/utils/api"
import { Trophy, CheckCircle, XCircle, Lightbulb, RotateCcw, BookOpen, ArrowDown } from "lucide-react"

const PRIMARY_TEAL = "bg-teal-600 hover:bg-teal-700"
const PRIMARY_TEAL_LOAD = "bg-teal-400"
const SUCCESS_GREEN = "text-emerald-600"
const ERROR_RED = "text-red-500"
const EXPLANATION_BORDER = "border-teal-500"
const AI_EXPLANATION_BG = "bg-blue-50 border-blue-400 text-blue-800"

export default function QuizResults({ score, total, answers, questions, onRestart }) {
  const [aiExplanations, setAiExplanations] = useState({})
  const [loading, setLoading] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(false)

  const resourcesRef = useRef(null)
  const lastQuestionRef = useRef(null)

  const fetchAIExplanation = async (q, userAnswer) => {
    try {
      setLoading(prev => ({ ...prev, [q._id]: true }))
      const res = await api.post("/ai/explanation", {
        question: q.question,
        correctAnswer: q.options[q.correctIndex],
        selectedAnswer: userAnswer !== null ? q.options[userAnswer] : "Not Answered"
      })
      setAiExplanations(prev => ({ ...prev, [q._id]: res.data.explanation }))
    } catch (err) {
      setAiExplanations(prev => ({ ...prev, [q._id]: "⚠️ Failed to fetch AI explanation." }))
    } finally {
      setLoading(prev => ({ ...prev, [q._id]: false }))
    }
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecs(true)
        const quizResults = questions.map(q => {
          const ans = answers.find(a => a.questionId === q._id)
          return {
            topic: q.question,
            score: ans && ans.selected === q.correctIndex ? 1 : 0,
            total: 1
          }
        })
        const res = await api.post("/ai/recommendations", { quizResults })
        setRecommendations(res.data.recommendations || [])
      } catch (err) {
        console.error("Error fetching recommendations:", err)
      } finally {
        setLoadingRecs(false)
      }
    }
    fetchRecommendations()
  }, [])

  const handleScrollDown = () => {
    if (window.innerWidth < 768) {
      // mobile: scroll to resources
      resourcesRef.current?.scrollIntoView({ behavior: "smooth" })
    } else {
      // desktop: scroll to last question
      lastQuestionRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto">
      {/* --- TOP: Quiz Result Centered --- */}
      <div className="flex justify-center mb-6">
        <div className={`${PRIMARY_TEAL} text-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg flex flex-col items-center gap-2 text-center`}>
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-wide">Quiz Result</h2>
          <p className="text-xl sm:text-2xl font-extrabold mt-1">{score} / {total}</p>
          <p className="text-sm sm:text-base opacity-90">
            {score === total
              ? "Perfect score! Outstanding work"
              : score > total * 0.5
                ? "Great job! Keep the momentum going"
                : "Review the answers and try again"}
          </p>
        </div>
      </div>

      
      {/* --- TWO COLUMN LAYOUT: Questions (Left) and Resources (Right) --- */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT: Questions */}
        <div className="flex-1 space-y-3">
          {questions.map((q, index) => {
            const userAnswerObj = answers.find(a => a.questionId === q._id)
            const userAnswer = userAnswerObj ? userAnswerObj.selected : null
            const isCorrect = userAnswer === q.correctIndex
            const notAnswered = userAnswer === null

            const isLastQuestion = index === questions.length - 1

            return (
              <div
                key={index}
                ref={isLastQuestion ? lastQuestionRef : null}
                className="p-3 border border-gray-200 rounded-lg shadow-sm"
              >
                <p className="font-semibold mb-1 text-sm md:text-base text-gray-800">
                  {index + 1}. {q.question}
                </p>

                <div className="text-sm md:text-sm space-y-1">
                  {isCorrect ? (
                    <p className={`flex items-start ${SUCCESS_GREEN} font-medium`}>
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      You answered correctly!
                    </p>
                  ) : (
                    <>
                      <p className={`flex items-start ${ERROR_RED} font-medium`}>
                        <XCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        Your Answer: {notAnswered ? "Not Answered" : q.options[userAnswer]}
                      </p>
                      <p className={`flex items-start ${SUCCESS_GREEN} font-medium`}>
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        Correct Answer: {q.options[q.correctIndex]}
                      </p>
                    </>
                  )}
                </div>

                {!aiExplanations[q._id] && q.explanation && (
                  <div className={`mt-2 bg-gray-50 border-l-4 ${EXPLANATION_BORDER} p-2 rounded-md text-gray-700 text-sm`}>
                    <span className="font-semibold text-teal-700">Explanation:</span> {q.explanation}
                  </div>
                )}

                <div className="mt-2">
                  <button
                    disabled={loading[q._id]}
                    onClick={() => fetchAIExplanation(q, userAnswer)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-sm font-medium transition-colors ${loading[q._id] ? PRIMARY_TEAL_LOAD : PRIMARY_TEAL}`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {loading[q._id] ? "Generating..." : "AI Explanation"}
                  </button>

                  {aiExplanations[q._id] && (
                    <div className={`mt-2 ${AI_EXPLANATION_BG} border-l-4 p-2 rounded-md text-sm`}>
                      <span className="font-bold flex items-center gap-1 mb-1">
                        <Lightbulb className="w-4 h-4" /> AI Explanation:
                      </span>
                      {aiExplanations[q._id]}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* --- Restart Button Below Questions --- */}
          <div className="mt-6 flex justify-center md:justify-start">
            <button
              onClick={onRestart}
              className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 md:px-6 md:py-3 rounded-full shadow-lg flex items-center gap-2 text-sm sm:text-base md:text-base font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5 md:w-5 md:h-5" />
              Restart Quiz
            </button>
          </div>
        </div>

        {/* RIGHT: Resource Recommendations */}
        <div className="w-full md:w-1/3" ref={resourcesRef}>
          <h3 className="text-xl md:text-2xl font-semibold text-[#267373] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Personalized Learning Resources
          </h3>

          {loadingRecs ? (
            <p className="text-gray-500 italic">Analyzing your performance and generating recommendations...</p>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  className="block border border-gray-200 p-3 rounded-lg bg-gray-50 hover:shadow-md transition-all"
                >
                  <h4 className="font-medium text-gray-800">{r.title}</h4>
                  <p className="text-sm text-gray-500 capitalize">{r.type}</p>
                  <span className="text-[#267373] underline text-sm mt-1 inline-block">
                    View Resource →
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No specific recommendations this time — great job!</p>
          )}
        </div>
      </div>
      
      {/* --- Scroll Down Arrow --- */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 cursor-pointer z-50 animate-bounce bg-white p-2 rounded-full shadow-lg"
        onClick={handleScrollDown}
      >
        <ArrowDown className="w-6 h-6 text-gray-500" />
      </div>
    </div>
  )
}