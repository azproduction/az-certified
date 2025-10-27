'use client'

import type { CertificateTier } from '@/types/quiz'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const SVGContainer = styled.div<{ $tier: string }>`
  position: relative;
  width: 100%;
  max-width: 792px;
  margin: 0 auto;

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Dynamically recolor star based on tier */
  svg path[fill="#edd78d"],
  svg path[fill="#EDD78D"] {
    fill: ${(props) => {
      const tier = props.$tier.toLowerCase()
      if (tier === 'platinum')
        return '#c4b5fd' // Light purple
      if (tier === 'gold')
        return '#edd78d' // Keep golden
      return '#cbd5e1' // Light silver
    }};
  }

  svg path[fill="#d4b663"],
  svg path[fill="#D4B663"] {
    fill: ${(props) => {
      const tier = props.$tier.toLowerCase()
      if (tier === 'platinum')
        return '#a78bfa' // Purple
      if (tier === 'gold')
        return '#d4b663' // Keep golden
      return '#94a3b8' // Silver
    }};
  }

  /* Background color based on tier */
  svg path[fill="#f4f9f9"],
  svg path[fill="#F4F9F9"] {
    fill: ${(props) => {
      const tier = props.$tier.toLowerCase()
      if (tier === 'platinum')
        return '#faf5ff' // Very light purple
      if (tier === 'gold')
        return '#fffbeb' // Very light gold/cream
      return '#f8fafc' // Very light gray
    }};
  }
`

interface CertificateSVGFrameProps {
  tier: CertificateTier
}

export function CertificateSVGFrame({ tier }: CertificateSVGFrameProps) {
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    fetch('/certificate-frame.svg')
      .then(res => res.text())
      .then((svg) => {
        setSvgContent(svg)
      })
      .catch(err => console.error('Failed to load certificate SVG:', err))
  }, [])

  if (!svgContent)
    return null

  return (
    <SVGContainer
      $tier={tier}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
