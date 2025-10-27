import { z } from 'zod'

// Question from JSONL file
export interface Question {
  id: string
  question: string
  options: string[]
  answer: number
  importance: 'normal' | 'critical'
  topic_tags: string[]
  slide_ref: number | null
  vtt_timestamp: string
  bloom_level: string
  difficulty: string
}

// Quiz state
export interface QuizState {
  selectedQuestions: Question[]
  answers: Record<string, number | null> // questionId -> answer index
  currentQuestionIndex: number
  startTime: number
  timeLimit: number // in milliseconds (1 hour)
}

// Certificate tiers
export type CertificateTier = 'Silver' | 'Gold' | 'Platinum' | 'Failed'

export interface CertificateResult {
  participantName: string
  totalQuestions: number
  correctAnswers: number
  score: number // percentage
  tier: CertificateTier
  completedAt: Date
  certificateId: string
}

// Thresholds from task.md
export const SCORE_THRESHOLDS = {
  Platinum: 95,
  Gold: 80,
  Silver: 60,
} as const

export const CRITICAL_QUESTION_FAIL_THRESHOLD = 2
export const TOTAL_QUESTIONS = 5
export const TIME_LIMIT_MS = 60 * 60 * 1000 // 1 hour

// Zod schemas for localStorage validation
export const participantNameSchema = z.object({
  name: z.string().min(1).max(100),
})

export type ParticipantName = z.infer<typeof participantNameSchema>
