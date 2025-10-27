'use client'

import type { CertificateResult } from '@/types/quiz'
import confetti from 'canvas-confetti'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { CertificateSVGFrame } from './CertificateSVGFrame'

const Container = styled.div<{ $tier: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => {
    const tier = props.$tier.toLowerCase()
    if (tier === 'platinum')
      return props.theme.colors.certificate.platinum.gradient
    if (tier === 'gold')
      return props.theme.colors.certificate.gold.gradient
    if (tier === 'silver')
      return props.theme.colors.certificate.silver.gradient
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }};
`

const CertificateWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 792px;
  container-type: inline-size;
  container-name: certificate;
  border-radius: 8px;
  overflow: hidden;
`

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12% 0 0 0;
  pointer-events: none;
`

const TopSection = styled.div`
  margin-top: 15%;
`

const CertificateTitle = styled.div<{ $tier: string }>`
  font-size: 8cqw;
  font-weight: 600;
  text-align: center;
  color: ${(props) => {
    const tier = props.$tier.toLowerCase()
    if (tier === 'platinum')
      return '#a78bfa'
    if (tier === 'gold')
      return '#d4b663'
    return '#94a3b8'
  }};
  text-transform: uppercase;
`

const Subtitle = styled.div`
  font-size: 2.5cqw;
  text-align: center;
  color: #303534;
  text-transform: uppercase;
`

const ParticipantName = styled.div`
  font-size: 7cqw;
  text-align: center;
  color: #303534;
  font-weight: 400;
  max-width: 80cqw;
  font-family: 'Georgia', 'Times New Roman', serif;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.5;
`

const DescriptionText = styled.div`
  font-size: 2cqw;
  text-align: center;
  color: #303534;
  line-height: 1.8;
  max-width: 70cqw;
  margin: 0 auto 2cqw auto;
`

const SignatureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const SignatureLabel = styled.div`
  font-family: var(--font-dancing-script), cursive;
  font-size: 4cqw;
  color: #303534;
`

const InfoRow = styled.div`
  display: flex;
  gap: 40%;
  justify-content: center;
  font-size: 1.5cqw;
  color: #6b7280;
  width: 100%;
  margin-top: -2cqw;
`

const InfoItem = styled.div`
  font-family: var(--font-dancing-script), cursive;
`

interface CertificateProps {
  result: CertificateResult
  onRestart: () => void
}

export function CertificateWithSVG({ result, onRestart }: CertificateProps) {
  useEffect(() => {
    // Tier-specific confetti configurations
    const confettiConfig = {
      Platinum: {
        colors: ['#a78bfa', '#8b5cf6', '#c084fc', '#e9d5ff', '#ffffff'],
        particleCount: 5,
        spread: 70,
        duration: 4000,
        scalar: 1.2,
        shapes: ['star', 'circle'],
      },
      Gold: {
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#fde68a', '#fffbeb'],
        particleCount: 4,
        spread: 60,
        duration: 3500,
        scalar: 1.1,
        shapes: ['circle'],
      },
      Silver: {
        colors: ['#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#ffffff'],
        particleCount: 3,
        spread: 55,
        duration: 3000,
        scalar: 1,
        shapes: ['circle'],
      },
    }

    const config = confettiConfig[result.tier as keyof typeof confettiConfig]
    const end = Date.now() + config.duration

    const frame = () => {
      confetti({
        particleCount: config.particleCount,
        angle: 60,
        spread: config.spread,
        origin: { x: 0 },
        colors: config.colors,
        scalar: config.scalar,
        shapes: config.shapes as confetti.Shape[],
      })
      confetti({
        particleCount: config.particleCount,
        angle: 120,
        spread: config.spread,
        origin: { x: 1 },
        colors: config.colors,
        scalar: config.scalar,
        shapes: config.shapes as confetti.Shape[],
      })

      if (Date.now() < end)
        requestAnimationFrame(frame)
    }

    frame()

    // Special platinum burst
    if (result.tier === 'Platinum') {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.6 },
          colors: config.colors,
          shapes: ['star'],
          scalar: 1.5,
        })
      }, 500)
    }
  }, [result.tier])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Container $tier={result.tier}>
      <CertificateWrapper>
        <CertificateSVGFrame tier={result.tier} />
        <TextOverlay>
          <TopSection>
            <CertificateTitle $tier={result.tier}>
              Certificate
            </CertificateTitle>

            <Subtitle>
              This
              {' '}
              {result.tier}
              {' '}
              Certificate is proudly presented to
            </Subtitle>

            <ParticipantName>{result.participantName}</ParticipantName>

            <DescriptionText>
              has successfully completed the A.Z. Certified Exam
              and demonstrated exceptional knowledge in the field,
              achieving a score of
              {' '}
              {result.correctAnswers}
              /
              {result.totalQuestions}
              {' '}
              (
              {result.score}
              %)
            </DescriptionText>
          </TopSection>

          <SignatureSection>
            <SignatureLabel>A.Z.Production</SignatureLabel>

            <InfoRow>
              <InfoItem>
                {formatDate(result.completedAt)}
              </InfoItem>
              <InfoItem>
                {result.certificateId}
              </InfoItem>
            </InfoRow>
          </SignatureSection>
        </TextOverlay>
      </CertificateWrapper>
    </Container>
  )
}
