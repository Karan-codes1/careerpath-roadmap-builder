'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/utils/api'
import QuizResults from '@/components/QuizResults'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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

    if (loading) return <div className="text-center mt-20 text-gray-500">Loading quiz...</div>

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
                <img
                    src="/undraw_page-not-found_6wni.svg"
                    alt="Not Found"
                    className="w-64 md:w-80 mb-6"
                />
                <p className="text-gray-600 text-base md:text-lg font-medium text-center">{error}</p>
            </div>
        )
    }

    if (!quiz) return null

    const progress = (answers.length / quiz.questions.length) * 100
    const currentQ = quiz.questions[currentIndex]
    const userAnswer = answers.find(q => q.questionId === currentQ._id)?.selected

    if (showResults) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 flex justify-center">
                <QuizResults
                    score={calculateScore()}
                    total={quiz.questions.length}
                    answers={answers}
                    questions={quiz.questions}
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-2 flex justify-center">
            <div className="w-full max-w-2xl md:max-w-4xl">
                {/* Header + Progress */}
                <Card className="shadow-xl rounded-2xl overflow-hidden mb-4 md:mb-6">
                    <CardHeader className="bg-[#339999] text-white p-4 md:p-5">
                        <CardTitle className="flex justify-between items-center font-semibold text-base md:text-lg">
                            <span>{quiz.title}</span>
                            <span className="text-xs md:text-sm">
                                Question {currentIndex + 1} / {quiz.questions.length}
                            </span>
                        </CardTitle>
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-200 mb-1">
                                <span>{Math.round(progress)}% completed</span>
                            </div>
                            <Progress
                                value={progress}
                                className="h-2 md:h-3 rounded-full bg-gray-300"
                            />
                        </div>
                    </CardHeader>
                </Card>

                {/* Question Card */}
                <Card className="shadow-md rounded-2xl p-4 md:p-6 mb-4">
                    <CardContent>
                        <Question
                            question={currentQ}
                            questionNumber={currentIndex + 1}
                            selectedOption={userAnswer}
                            onAnswerSelect={(option) => handleAnswer(currentQ._id, option)}
                            userAnswer={userAnswer}
                        />
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
                    <button
                        disabled={currentIndex === 0}
                        onClick={prevQuestion}
                        className={`flex-1 px-3 py-2 rounded-xl flex items-center justify-center gap-2 border 
                          ${currentIndex === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" :
                                "bg-white hover:bg-gray-100 text-gray-700"}`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="flex gap-2 flex-1 mt-2 sm:mt-0">
                        <button
                            onClick={() => clearAnswer(currentQ._id)}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Clear
                        </button>

                        <button
                            onClick={nextQuestion}
                            className="flex-1 px-3 py-2 rounded-xl bg-[#339999] text-white hover:bg-[#2B8080] flex items-center justify-center gap-2"
                        >
                            {currentIndex === quiz.questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center mt-4 gap-2">
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
                                    ${isCurrent ? "bg-[#267373] text-white hover:bg-[#1F5C5C]"  :
                                        isAnswered ? "bg-[#339999] text-white hover:bg-[#2B8080]"  :
                                            "bg-gray-200 text-gray-700 hover:bg-gray-300"}
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
