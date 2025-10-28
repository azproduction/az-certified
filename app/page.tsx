'use client'

import type { CertificateResult, Question } from '@/types/quiz'
import React, { useEffect, useState } from 'react'
import { CertificateWithSVG } from '@/components/CertificateNew'
import { Failure } from '@/components/Failure'
import { NameInput } from '@/components/NameInput'
import { Quiz } from '@/components/Quiz'
import { generateQuizQuestions } from '@/lib/questionLoader'
import { calculateResults } from '@/lib/scoring'
import { loadParticipantName, saveParticipantName } from '@/lib/storage'
import { CRITICAL_QUESTION_FAIL_THRESHOLD, TIME_LIMIT_MS } from '@/types/quiz'

type Screen = 'name' | 'quiz' | 'failure' | 'certificate'
type FailureReason = 'time' | 'critical' | 'score'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('name')
  const [participantName, setParticipantName] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_MS)
  const [certificateResult, setCertificateResult] = useState<CertificateResult | null>(null)
  const [failureReason, setFailureReason] = useState<FailureReason>('score')
  const [failureStats, setFailureStats] = useState<{
    totalQuestions: number
    correctAnswers: number
    score: number
    criticalQuestionsWrong: number
  }>({
    totalQuestions: 0,
    correctAnswers: 0,
    score: 0,
    criticalQuestionsWrong: 0,
  })

  // Load participant name on mount
  useEffect(() => {
    const savedName = loadParticipantName()
    if (savedName) {
      setParticipantName(savedName)
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (screen !== 'quiz' || startTime === 0)
      return

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, TIME_LIMIT_MS - elapsed)
      setTimeRemaining(remaining)

      // Time's up!
      if (remaining === 0) {
        // Calculate statistics for time failure
        let criticalWrong = 0
        let correctAnswers = 0

        questions.forEach((question) => {
          const userAnswer = answers[question.id]
          if (userAnswer === question.answer) {
            correctAnswers++
          }
          if (userAnswer !== question.answer && question.importance === 'critical') {
            criticalWrong++
          }
        })

        const score = (correctAnswers / questions.length) * 100

        setFailureStats({
          totalQuestions: questions.length,
          correctAnswers,
          score,
          criticalQuestionsWrong: criticalWrong,
        })

        setFailureReason('time')
        setScreen('failure')
      }
    }, 100)

    return () => clearInterval(interval)
  }, [screen, startTime, questions, answers])

  const startQuiz = () => {
    const selectedQuestions = generateQuizQuestions()
    setQuestions(selectedQuestions)

    // Initialize answers with null for all questions
    const initialAnswers: Record<string, number | null> = {}
    selectedQuestions.forEach((q) => {
      initialAnswers[q.id] = null
    })
    setAnswers(initialAnswers)

    setCurrentQuestionIndex(0)
    setStartTime(Date.now())
    setTimeRemaining(TIME_LIMIT_MS)
    setScreen('quiz')
  }

  const handleNameSubmit = (name: string) => {
    saveParticipantName(name)
    setParticipantName(name)
    startQuiz()
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    const result = calculateResults(questions, answers, participantName)

    // Check for failure conditions
    if (result.tier === 'Failed') {
      // Calculate statistics
      let criticalWrong = 0
      let correctAnswers = 0

      questions.forEach((question) => {
        const userAnswer = answers[question.id]
        if (userAnswer === question.answer) {
          correctAnswers++
        }
        if (userAnswer !== question.answer && question.importance === 'critical') {
          criticalWrong++
        }
      })

      const score = (correctAnswers / questions.length) * 100

      // Store failure statistics
      setFailureStats({
        totalQuestions: questions.length,
        correctAnswers,
        score,
        criticalQuestionsWrong: criticalWrong,
      })

      if (criticalWrong >= CRITICAL_QUESTION_FAIL_THRESHOLD) {
        setFailureReason('critical')
      }
      else {
        setFailureReason('score')
      }

      setScreen('failure')
    }
    else {
      setCertificateResult(result)
      setScreen('certificate')
    }
  }

  const handleRestart = () => {
    setScreen('name')
    setQuestions([])
    setAnswers({})
    setCurrentQuestionIndex(0)
    setStartTime(0)
    setTimeRemaining(TIME_LIMIT_MS)
    setCertificateResult(null)
  }

  // Render current screen
  if (screen === 'name') {
    return <NameInput onSubmit={handleNameSubmit} initialName={participantName} />
  }

  if (screen === 'quiz') {
    return (
      <Quiz
        questions={questions}
        answers={answers}
        currentIndex={currentQuestionIndex}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        timeRemaining={timeRemaining}
      />
    )
  }

  if (screen === 'failure') {
    return (
      <Failure
        reason={failureReason}
        onRestart={handleRestart}
        totalQuestions={failureStats.totalQuestions}
        correctAnswers={failureStats.correctAnswers}
        score={failureStats.score}
        criticalQuestionsWrong={failureStats.criticalQuestionsWrong}
      />
    )
  }

  if (screen === 'certificate' && certificateResult) {
    return <CertificateWithSVG result={certificateResult} />
  }

  return null
}
