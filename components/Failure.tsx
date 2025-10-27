'use client';

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${(props) => props.theme.spacing.lg};
`;

const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing['3xl']};
  box-shadow: ${(props) => props.theme.shadows.xl};
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSizes['3xl']};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text};
`;

const Message = styled.p`
  font-size: ${(props) => props.theme.fontSizes.lg};
  color: ${(props) => props.theme.colors.textLight};
  margin-bottom: ${(props) => props.theme.spacing['2xl']};
  line-height: 1.6;
`;

const Button = styled.button`
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.xl};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: 600;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: background-color ${(props) => props.theme.transitions.fast};

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }
`;

interface FailureProps {
  reason: 'time' | 'critical' | 'score';
  onRestart: () => void;
}

export function Failure({ reason, onRestart }: FailureProps) {
  const getMessage = () => {
    switch (reason) {
      case 'time':
        return 'Unfortunately, the time limit has expired. The quiz requires completion within one hour.';
      case 'critical':
        return 'You did not pass this quiz. Critical questions are essential and failing 2 or more results in an automatic fail.';
      case 'score':
        return 'Unfortunately, your score did not meet the minimum threshold of 60% required for certification.';
      default:
        return 'Unfortunately, you did not pass this quiz.';
    }
  };

  return (
    <Container>
      <Card>
        <Icon>😔</Icon>
        <Title>Not today</Title>
        <Message>{getMessage()}</Message>
        <Message>
          Don't worry! Take some time to review the material and try again when you're ready.
        </Message>
        <Button onClick={onRestart}>Try Again</Button>
      </Card>
    </Container>
  );
}
