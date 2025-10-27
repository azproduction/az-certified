import type {
  CertificateResult,
  CertificateTier,
  Question,
} from '@/types/quiz'
import {
  CRITICAL_QUESTION_FAIL_THRESHOLD,
  SCORE_THRESHOLDS,
} from '@/types/quiz'

/**
 * Generate a unique certificate ID
 */
export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `CERT-${timestamp}-${random}`.toUpperCase()
}

/**
 * Calculate quiz results and determine certificate tier
 */
export function calculateResults(
  questions: Question[],
  answers: Record<string, number | null>,
  participantName: string,
): CertificateResult {
  let correctAnswers = 0
  let criticalWrong = 0

  // Count correct answers and critical failures
  questions.forEach((question) => {
    const userAnswer = answers[question.id]
    if (userAnswer === question.answer) {
      correctAnswers++
    }
    else if (question.importance === 'critical') {
      criticalWrong++
    }
  })

  const score = (correctAnswers / questions.length) * 100

  // Determine tier
  let tier: CertificateTier = 'Failed'

  // Auto-fail if 2 or more critical questions are wrong
  if (criticalWrong >= CRITICAL_QUESTION_FAIL_THRESHOLD) {
    tier = 'Failed'
  }
  else {
    // Check thresholds (must meet threshold, not round up)
    if (score >= SCORE_THRESHOLDS.Platinum) {
      tier = 'Platinum'
    }
    else if (score >= SCORE_THRESHOLDS.Gold) {
      tier = 'Gold'
    }
    else if (score >= SCORE_THRESHOLDS.Silver) {
      tier = 'Silver'
    }
  }

  return {
    participantName,
    totalQuestions: questions.length,
    correctAnswers,
    score: Math.round(score * 10) / 10, // Round to 1 decimal place
    tier,
    completedAt: new Date(),
    certificateId: generateCertificateId(),
  }
}
