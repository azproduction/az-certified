'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Question } from '@/types/quiz';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: ${(props) => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
`;

const ProgressText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const Timer = styled.div<{ $warning?: boolean }>`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: 600;
  color: ${(props) => props.$warning ? props.theme.colors.error : props.theme.colors.primary};
  font-variant-numeric: tabular-nums;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width ${(props) => props.theme.transitions.base};
`;

const QuizContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const QuestionCard = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const QuestionText = styled.h2`
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.4;
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.fontSizes.lg};
  text-align: left;
  background-color: ${(props) =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.background};
  color: ${(props) =>
    props.$selected ? 'white' : props.theme.colors.text};
  border: 2px solid ${(props) =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.surface};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${(props) => props.theme.spacing.md};
  width: 100%;
`;

const NavButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.xl};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: 600;
  color: ${(props) =>
    props.$variant === 'primary' ? 'white' : props.theme.colors.primary};
  background-color: ${(props) =>
    props.$variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: all ${(props) => props.theme.transitions.fast};
  flex: 1;

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.$variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.surface};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface QuizProps {
  questions: Question[];
  answers: Record<string, number | null>;
  currentIndex: number;
  onAnswerSelect: (questionId: string, answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  timeRemaining: number; // in milliseconds
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
}: QuizProps) {
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const selectedAnswer = answers[currentQuestion.id];

  // Format time remaining
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isTimeWarning = timeRemaining < 5 * 60 * 1000; // Less than 5 minutes

  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
      onSubmit();
    }
  };

  return (
    <Container>
      <Header>
        <ProgressText>
          Question {currentIndex + 1} / {questions.length}
        </ProgressText>
        <Timer $warning={isTimeWarning}>{formatTime(timeRemaining)}</Timer>
      </Header>

      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>

      <QuizContent>
        <QuestionCard>
          <QuestionText>{currentQuestion.question}</QuestionText>
          <OptionsGrid>
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={index}
                $selected={selectedAnswer === index}
                onClick={() => onAnswerSelect(currentQuestion.id, index)}
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
          {isLastQuestion ? (
            <NavButton onClick={handleSubmit} $variant="primary">
              Submit Quiz
            </NavButton>
          ) : (
            <NavButton onClick={onNext} $variant="primary">
              Next
            </NavButton>
          )}
        </NavigationButtons>
      </QuizContent>
    </Container>
  );
}
