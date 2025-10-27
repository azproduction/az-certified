'use client'

import type { CertificateResult } from '@/types/quiz'
import confetti from 'canvas-confetti'
import React, { useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const CertificateCard = styled.div<{ $tier: string }>`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['3xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  max-width: 700px;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: ${(props) => {
      const tier = props.$tier.toLowerCase()
      if (tier === 'platinum')
        return props.theme.colors.certificate.platinum.gradient
      if (tier === 'gold')
        return props.theme.colors.certificate.gold.gradient
      return props.theme.colors.certificate.silver.gradient
    }};
  }
`

const BadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Badge = styled.div<{ $tier: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${(props) => {
    const tier = props.$tier.toLowerCase()
    if (tier === 'platinum')
      return props.theme.colors.certificate.platinum.gradient
    if (tier === 'gold')
      return props.theme.colors.certificate.gold.gradient
    return props.theme.colors.certificate.silver.gradient
  }};
  font-size: 3rem;
  box-shadow: ${props => props.theme.shadows.xl};
`

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['4xl']};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`

const Subtitle = styled.h2<{ $tier: string }>`
  font-size: ${props => props.theme.fontSizes['2xl']};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${(props) => {
    const tier = props.$tier.toLowerCase()
    if (tier === 'platinum')
      return props.theme.colors.certificate.platinum.accent
    if (tier === 'gold')
      return props.theme.colors.certificate.gold.accent
    return props.theme.colors.certificate.silver.accent
  }};
  font-weight: 700;
`

const Divider = styled.div<{ $tier: string }>`
  width: 100px;
  height: 4px;
  background: ${(props) => {
    const tier = props.$tier.toLowerCase()
    if (tier === 'platinum')
      return props.theme.colors.certificate.platinum.gradient
    if (tier === 'gold')
      return props.theme.colors.certificate.gold.gradient
    return props.theme.colors.certificate.silver.gradient
  }};
  margin: ${props => props.theme.spacing.xl} auto;
  border-radius: ${props => props.theme.borderRadius.full};
`

const ParticipantName = styled.div`
  font-size: ${props => props.theme.fontSizes['4xl']};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`

const ScoreText = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const ScoreValue = styled.div`
  font-size: ${props => props.theme.fontSizes['3xl']};
  text-align: center;
  color: ${props => props.theme.colors.text};
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border};
`

const InfoItem = styled.div`
  text-align: center;
`

const InfoLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const InfoValue = styled.div`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const Button = styled.button`
  width: 100%;
  margin-top: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  color: white;
  background-color: ${props => props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background-color ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`

interface CertificateProps {
  result: CertificateResult
  onRestart: () => void
}

export function Certificate({ result, onRestart }: CertificateProps) {
  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#667eea', '#764ba2', '#f093fb'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#667eea', '#764ba2', '#f093fb'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  const getTierEmoji = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return '💎'
      case 'gold':
        return '🏆'
      case 'silver':
        return '🥈'
      default:
        return '🎓'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Container>
      <CertificateCard $tier={result.tier}>
        <BadgeContainer>
          <Badge $tier={result.tier}>{getTierEmoji(result.tier)}</Badge>
        </BadgeContainer>

        <Title>Certificate of Achievement</Title>
        <Subtitle $tier={result.tier}>
          AZ Certified –
          {result.tier}
          {' '}
          Level
        </Subtitle>

        <Divider $tier={result.tier} />

        <ParticipantName>{result.participantName}</ParticipantName>

        <Divider $tier={result.tier} />

        <ScoreValue>
          {result.correctAnswers}
          {' '}
          /
          {result.totalQuestions}
          {' '}
          correct
        </ScoreValue>
        <ScoreText>
          Score:
          {result.score}
          %
        </ScoreText>

        <InfoGrid>
          <InfoItem>
            <InfoLabel>Date</InfoLabel>
            <InfoValue>{formatDate(result.completedAt)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Certificate ID</InfoLabel>
            <InfoValue>{result.certificateId}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <Button onClick={onRestart}>Take Quiz Again</Button>
      </CertificateCard>
    </Container>
  )
}
