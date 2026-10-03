'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/utils/api'
import QuizResults from '@/components/QuizResults'
import { Progress } from '@/components/ui/progress'
import Question from '@/components/Question'
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

export default function QuizPage() {
    const { id } = useParams()
    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quiz/${id}`)
                if (res.data.success && res.data.quizzes.length > 0) {
                    setQuiz(res.data.quizzes[0])
                } else setError("No quiz found for this roadmap.")
            } catch (err) {
                console.error(err)
                setError("Failed to fetch quiz.")
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchQuiz()
    }, [id])

    const handleAnswer = (questionId, optionIndex) => {
        setAnswers(prev => {
            const filtered = prev.filter(a => a.questionId !== questionId)
            return [...filtered, { questionId, selected: optionIndex }]
        })
    }

    const clearAnswer = (questionId) => {
        setAnswers(prev => prev.filter(a => a.questionId !== questionId))
    }

    const nextQuestion = () => {
        if (currentIndex < quiz.questions.length - 1) setCurrentIndex(prev => prev + 1)
        else setShowResults(true)
    }

    const prevQuestion = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
    }

    const calculateScore = () => {
        return answers.reduce((acc, ans) => {
            const q = quiz.questions.find(q => q._id === ans.questionId)
            return q && q.correctIndex === ans.selected ? acc + 1 : acc
        }, 0)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 dark:from-gray-950 to-gray-100 dark:to-gray-900 py-6 px-4 flex justify-center">
                <div className="w-full max-w-2xl md:max-w-4xl animate-pulse space-y-4">
                    <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                    <div className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">Loading quiz...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-950 px-4">
                <img
                    src="/undraw_page-not-found_6wni.svg"
                    alt="Not Found"
                    className="w-64 md:w-80 mb-6"
                />
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-medium text-center">{error}</p>
            </div>
        )
    }

    if (!quiz) return null

    const progress = (answers.length / quiz.questions.length) * 100
    const currentQ = quiz.questions[currentIndex]
    const userAnswer = answers.find(q => q.questionId === currentQ._id)?.selected

    if (showResults) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 dark:from-gray-950 to-gray-100 dark:to-gray-900 py-8 px-4 flex justify-center">
                <QuizResults
                    score={calculateScore()}
                    total={quiz.questions.length}
                    answers={answers}
                    questions={quiz.questions}
                    title={quiz.title}
                    roadmapId={id}
                    onRestart={() => {
                        setCurrentIndex(0)
                        setAnswers([])
                        setShowResults(false)
                    }}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 dark:from-gray-950 to-gray-100 dark:to-gray-900 py-6 px-4 flex justify-center">
            <div className="w-full max-w-2xl md:max-w-4xl">
                {/* Header + Progress */}
                <div className="mb-4 rounded-2xl bg-[#339999] p-4 text-white shadow-lg md:mb-6 md:p-6">
                    <div className="flex items-center justify-between gap-3 font-semibold">
                        <h1 className="text-base md:text-xl">{quiz.title}</h1>
                        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">
                            Question {currentIndex + 1} / {quiz.questions.length}
                        </span>
                    </div>
                    <div className="mt-3">
                        <div className="mb-1.5 flex justify-between text-xs text-white/85">
                            <span>{Math.round(progress)}% completed</span>
                            <span>{answers.length} of {quiz.questions.length} answered</span>
                        </div>
                        <Progress
                            value={progress}
                            className="h-2 md:h-2.5 bg-white/30 dark:bg-white/30"
                            indicatorClassName="bg-white"
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="mb-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-md md:p-8">
                    <Question
                        question={currentQ}
                        questionNumber={currentIndex + 1}
                        selectedOption={userAnswer}
                        onAnswerSelect={(option) => handleAnswer(currentQ._id, option)}
                        userAnswer={userAnswer}
                    />
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
                    <button
                        disabled={currentIndex === 0}
                        onClick={prevQuestion}
                        className={`flex-1 px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 border text-sm font-medium transition-colors
                          ${currentIndex === 0 ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" :
                                "bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="flex gap-2 flex-1">
                        <button
                            onClick={() => clearAnswer(currentQ._id)}
                            className="flex-1 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Clear
                        </button>

                        <button
                            onClick={nextQuestion}
                            className="flex-1 px-3 py-2.5 rounded-xl bg-[#339999] text-sm font-medium text-white hover:bg-[#2B8080] flex items-center justify-center gap-2 transition-colors"
                        >
                            {currentIndex === quiz.questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center mt-5 gap-2">
                    {quiz.questions.map((q, idx) => {
                        const isAnswered = answers.some(a => a.questionId === q._id)
                        const isCurrent = idx === currentIndex

                        return (
                            <button
                                key={q._id}
                                onClick={() => setCurrentIndex(idx)}
                                title={`Go to Question ${idx + 1}`}
                                className={`
                                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300
                                    ${isCurrent ? "bg-[#267373] text-white hover:bg-[#1F5C5C] ring-2 ring-[#267373]/30 ring-offset-2 dark:ring-offset-gray-950"  :
                                        isAnswered ? "bg-[#339999] text-white hover:bg-[#2B8080]"  :
                                            "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}
                                `}
                            >
                                {idx + 1}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
