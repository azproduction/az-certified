'use client'

import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
`

const Card = styled.div`
  max-width: 500px;
  width: 100%;
`

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
  color: ${props => props.theme.colors.text};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.base};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const Button = styled.button`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

interface NameInputProps {
  onSubmit: (name: string) => void
  initialName?: string
}

export function NameInput({ onSubmit, initialName = '' }: NameInputProps) {
  const [name, setName] = useState(initialName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <Container>
      <Card>
        <Title>AZ Certified Quiz</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              required
              autoFocus
            />
          </InputGroup>
          <Button type="submit" disabled={!name.trim()}>
            Start Quiz
          </Button>
        </Form>
      </Card>
    </Container>
  )
}
