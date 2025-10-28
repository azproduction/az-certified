import type { Question } from '@/types/quiz'
import { questionSchema, TOTAL_QUESTIONS } from '@/types/quiz'

// Import JSONL file as raw string (webpack configured to handle this)
// @ts-expect-error - webpack will handle this import
import questionsRaw from '../questions.jsonl'

/**
 * Parse JSONL file content into an array of questions
 */
export function parseQuestionsFromJSONL(raw: string): Question[] {
  const lines = raw.trim().split('\n')
  return lines
    .filter(line => line.trim().length > 0)
    .map((line, index) => {
      let parsed: unknown

      // First try to parse JSON
      try {
        parsed = JSON.parse(line)
      }
      catch (jsonError) {
        throw new Error(
          `Failed to parse JSON at line ${index + 1}:\n` +
          `Error: ${jsonError}\n` +
          `Line content: ${line.substring(0, 200)}...`
        )
      }

      // Then validate with Zod schema
      try {
        return questionSchema.parse(parsed)
      }
      catch (zodError) {
        throw new Error(
          `Question validation failed at line ${index + 1}:\n` +
          `${zodError}\n` +
          `Line content: ${line.substring(0, 200)}...`
        )
      }
    })
}

/**
 * Select 50 questions: all critical questions + random selection from normal questions
 */
export function selectQuestions(allQuestions: Question[]): Question[] {
  const critical = allQuestions.filter(q => q.importance === 'critical')
  const normal = allQuestions.filter(q => q.importance === 'normal')

  // Ensure we have enough questions
  if (critical.length + normal.length < TOTAL_QUESTIONS) {
    throw new Error('Not enough questions in the question bank')
  }

  // Calculate how many normal questions we need
  const normalNeeded = TOTAL_QUESTIONS - critical.length

  // Randomly select normal questions
  const shuffledNormal = [...normal].sort(() => Math.random() - 0.5)
  const selectedNormal = shuffledNormal.slice(0, normalNeeded)

  // Combine and shuffle all selected questions
  const allSelected = [...critical, ...selectedNormal]
  return allSelected.sort(() => Math.random() - 0.5)
}

/**
 * Get all questions from the embedded JSONL data
 */
export function getAllQuestions(): Question[] {
  return parseQuestionsFromJSONL(questionsRaw)
}

/**
 * Generate a random set of 50 questions for a new quiz session
 */
export function generateQuizQuestions(): Question[] {
  const allQuestions = getAllQuestions()
  return selectQuestions(allQuestions)
}
