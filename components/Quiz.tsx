'use client'

import type { Question } from '@/types/quiz'
import { DEFAULT_QUIZ_CONFIG } from '@/types/quiz'
import React, { useMemo } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`

const ProgressText = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

const Timer = styled.div<{ $warning?: boolean }>`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  color: ${props => props.$warning ? props.theme.colors.error : props.theme.colors.primary};
  font-variant-numeric: tabular-nums;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: ${props => props.theme.colors.primary};
  transition: width ${props => props.theme.transitions.base};
`

const QuizContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`

const QuestionCard = styled.div`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const QuestionText = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`

const TopicTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Tag = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 500;
`

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSizes.lg};
  text-align: left;
  background-color: ${props =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props =>
    props.$selected ? 'white' : props.theme.colors.text};
  border: 2px solid ${props =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.surface};
  }
`

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`

const NavButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  color: ${props =>
    props.$variant === 'primary' ? 'white' : props.theme.colors.primary};
  background-color: ${props =>
    props.$variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  flex: 1;

  &:hover:not(:disabled) {
    background-color: ${props =>
      props.$variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.surface};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

interface QuizProps {
  questions: Question[]
  answers: Record<string, number | null>
  currentIndex: number
  onAnswerSelect: (questionId: string, answerIndex: number) => void
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  timeRemaining: number // in milliseconds
  shuffleOptions?: boolean
  shuffleSeed?: number
}

export function Quiz({
  questions,
  answers,
  currentIndex,
  onAnswerSelect,
  onNext,
  onPrevious,
  onSubmit,
  timeRemaining,
  shuffleOptions = DEFAULT_QUIZ_CONFIG.shuffleOptions,
  shuffleSeed = DEFAULT_QUIZ_CONFIG.shuffleSeed,
}: QuizProps) {
  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isLastQuestion = currentIndex === questions.length - 1
  const selectedAnswer = answers[currentQuestion.id]

  // Shuffle options if enabled - maintains consistent shuffle per question
  const shuffledOptions = useMemo(() => {
    if (!shuffleOptions) {
      return currentQuestion.options.map((option, index) => ({ option, originalIndex: index }))
    }

    // Create array of options with their original indices
    const optionsWithIndices = currentQuestion.options.map((option, index) => ({
      option,
      originalIndex: index,
    }))

    // Determine seed: use provided shuffleSeed, or fall back to question ID-based seed
    const seed = shuffleSeed ?? currentQuestion.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const random = (index: number) => {
      const x = Math.sin(seed + index) * 10000
      return x - Math.floor(x)
    }

    // Fisher-Yates shuffle with seeded random
    const shuffled = [...optionsWithIndices]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random(i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }, [currentQuestion.id, currentQuestion.options, shuffleOptions, shuffleSeed])

  // Format time remaining
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const isTimeWarning = timeRemaining < 5 * 60 * 1000 // Less than 5 minutes

  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
      onSubmit()
    }
  }

  return (
    <Container>
      <Header>
        <ProgressText>
          Question
          {' '}
          {currentIndex + 1}
          {' '}
          /
          {' '}
          {questions.length}
        </ProgressText>
        <Timer $warning={isTimeWarning}>{formatTime(timeRemaining)}</Timer>
      </Header>

      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>

      <QuizContent>
        <QuestionCard>
          <QuestionText>{currentQuestion.question}</QuestionText>
          {currentQuestion.topic_tags && currentQuestion.topic_tags.length > 0 && (
            <TopicTags>
              {currentQuestion.topic_tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TopicTags>
          )}
          <OptionsGrid>
            {shuffledOptions.map(({ option, originalIndex }, displayIndex) => (
              <OptionButton
                key={displayIndex}
                $selected={selectedAnswer === originalIndex}
                onClick={() => onAnswerSelect(currentQuestion.id, originalIndex)}
              >
                {option}
              </OptionButton>
            ))}
          </OptionsGrid>
        </QuestionCard>

        <NavigationButtons>
          <NavButton
            onClick={onPrevious}
            disabled={currentIndex === 0}
            $variant="secondary"
          >
            Previous
          </NavButton>
          {isLastQuestion
            ? (
                <NavButton onClick={handleSubmit} $variant="primary">
                  Submit Quiz
                </NavButton>
              )
            : (
                <NavButton onClick={onNext} $variant="primary">
                  Next
                </NavButton>
              )}
        </NavigationButtons>
      </QuizContent>
    </Container>
  )
}
