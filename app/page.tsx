'use client';

import React, { useState, useEffect } from 'react';
import { NameInput } from '@/components/NameInput';
import { Quiz } from '@/components/Quiz';
import { Failure } from '@/components/Failure';
import { Certificate } from '@/components/Certificate';
import { generateQuizQuestions } from '@/lib/questionLoader';
import { calculateResults } from '@/lib/scoring';
import { saveParticipantName, loadParticipantName } from '@/lib/storage';
import { Question, CertificateResult, TIME_LIMIT_MS, CRITICAL_QUESTION_FAIL_THRESHOLD } from '@/types/quiz';

type Screen = 'name' | 'quiz' | 'failure' | 'certificate';
type FailureReason = 'time' | 'critical' | 'score';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('name');
  const [participantName, setParticipantName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_MS);
  const [certificateResult, setCertificateResult] = useState<CertificateResult | null>(null);
  const [failureReason, setFailureReason] = useState<FailureReason>('score');

  // Load participant name on mount
  useEffect(() => {
    const savedName = loadParticipantName();
    if (savedName) {
      setParticipantName(savedName);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (screen !== 'quiz' || startTime === 0) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, TIME_LIMIT_MS - elapsed);
      setTimeRemaining(remaining);

      // Time's up!
      if (remaining === 0) {
        setFailureReason('time');
        setScreen('failure');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [screen, startTime]);

  const handleNameSubmit = (name: string) => {
    saveParticipantName(name);
    setParticipantName(name);
    startQuiz();
  };

  const startQuiz = () => {
    const selectedQuestions = generateQuizQuestions();
    setQuestions(selectedQuestions);

    // Initialize answers with null for all questions
    const initialAnswers: Record<string, number | null> = {};
    selectedQuestions.forEach((q) => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);

    setCurrentQuestionIndex(0);
    setStartTime(Date.now());
    setTimeRemaining(TIME_LIMIT_MS);
    setScreen('quiz');
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const result = calculateResults(questions, answers, participantName);

    // Check for failure conditions
    if (result.tier === 'Failed') {
      // Determine specific failure reason
      let criticalWrong = 0;
      questions.forEach((question) => {
        const userAnswer = answers[question.id];
        if (userAnswer !== question.answer && question.importance === 'critical') {
          criticalWrong++;
        }
      });

      if (criticalWrong >= CRITICAL_QUESTION_FAIL_THRESHOLD) {
        setFailureReason('critical');
      } else {
        setFailureReason('score');
      }

      setScreen('failure');
    } else {
      setCertificateResult(result);
      setScreen('certificate');
    }
  };

  const handleRestart = () => {
    setScreen('name');
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setStartTime(0);
    setTimeRemaining(TIME_LIMIT_MS);
    setCertificateResult(null);
  };

  // Render current screen
  if (screen === 'name') {
    return <NameInput onSubmit={handleNameSubmit} initialName={participantName} />;
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
    );
  }

  if (screen === 'failure') {
    return <Failure reason={failureReason} onRestart={handleRestart} />;
  }

  if (screen === 'certificate' && certificateResult) {
    return <Certificate result={certificateResult} onRestart={handleRestart} />;
  }

  return null;
}
