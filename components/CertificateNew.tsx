'use client'

import type { CertificateResult } from '@/types/quiz'
import confetti from 'canvas-confetti'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { CertificateSVGFrame } from './CertificateSVGFrame'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const CertificateWrapper = styled.div`
  position: relative;
  max-width: 900px;
  width: 100%;
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
  padding: 10% 8%;
  pointer-events: none;
`

const TopSection = styled.div`
  margin-top: 15%;
`

const CertificateTitle = styled.div<{ $tier: string }>`
  font-size: 4rem;
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
  font-size: 1.125rem;
  text-align: center;
  color: #303534;
  text-transform: uppercase;
`

const ParticipantName = styled.div`
  font-size: 3.5rem;
  text-align: center;
  color: #303534;
  font-weight: 400;
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.2;
`

const DescriptionText = styled.div`
  font-size: 1rem;
  text-align: center;
  color: #303534;
  margin: 0.5rem 0;
  max-width: 550px;
  line-height: 1.8;
`

const SignatureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const SignatureLabel = styled.div`
  font-family: var(--font-dancing-script), cursive;
  font-size: 2.5rem;
  color: #303534;
`

const SignatureLine = styled.div`
  width: 200px;
  border-bottom: 2px solid #303534;
  margin-bottom: 1rem;
`

const InfoRow = styled.div`
  display: flex;
  gap: 40%;
  justify-content: center;
  font-size: 0.75rem;
  color: #6b7280;
  width: 100%;
`

const InfoItem = styled.div`
  font-family: var(--font-dancing-script), cursive;
`

const RestartButton = styled.button`
  margin-top: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  color: white;
  background-color: ${props => props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background-color ${props => props.theme.transitions.fast};
  pointer-events: auto;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`

interface CertificateProps {
  result: CertificateResult
  onRestart: () => void
}

export function CertificateWithSVG({ result, onRestart }: CertificateProps) {
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

      if (Date.now() < end)
        requestAnimationFrame(frame)
    }

    frame()
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Container>
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
              has successfully completed the AZ Certified Quiz
              and demonstrated exceptional knowledge in the field,
              achieving a score of
              {' '}
              {result.correctAnswers}
              /
              {result.totalQuestions}
              {' '}
              (
              {result.score}
              %).
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
