# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **cosplay photography certification exam application** built with Next.js 16, React 19, and styled-components. Users take a timed 1-hour exam with 50 questions and receive tiered digital certificates (Silver, Gold, or Platinum) based on their performance.

## Development Commands

```bash
# Start development server (required: Node.js >=22.0.0)
npm run dev

# Build for production (static export to ./out directory)
npm run build

# Static export (alias for build)
npm run export

# Lint and auto-fix issues
npm run lint:fix
```

**Note**: The project uses Turbopack (Next.js 16's stable default bundler) for both development and production builds.

## Architecture

### Application Structure

This is a **Next.js App Router** application (not Pages Router). The project uses a screen-based state machine pattern:

```
'name' → 'quiz' → 'certificate' or 'failure'
```

Key directories:
- **app/** - Next.js App Router pages (`page.tsx` orchestrates quiz flow, `layout.tsx` handles metadata and providers)
- **components/** - React components (Quiz, NameInput, Certificate, Failure, SvgCertificateFrame)
- **lib/** - Business logic and utilities (question loading, scoring, localStorage wrapper)
- **types/** - TypeScript interfaces and Zod validation schemas
- **styles/** - styled-components theme, global styles, design tokens
- **public/** - Static assets including SVG certificate frame template

### Question Bank System

Questions are stored in a **JSONL file** (JSON Lines format). The Turbopack configuration uses `raw-loader` to import JSONL as raw strings:

```typescript
// next.config.ts Turbopack configuration
turbopack: {
  rules: {
    '*.jsonl': {
      loaders: ['raw-loader'],
      as: '*.js',
    },
  },
}
```

Questions are parsed and validated at runtime using Zod schemas. Each question has:
- Multiple choice options (shuffled with seeded algorithm)
- Importance level: `'normal'` or `'critical'` (2+ wrong critical questions = auto-fail)
- Topic tags, difficulty, Bloom's taxonomy level
- References to slide numbers and VTT timestamps

### Scoring Logic

The application selects **all critical questions** plus random normal questions for a total of 50 per quiz session.

**Certificate Tiers:**
- **Platinum**: 95%+ (triggers special confetti effect)
- **Gold**: 80-94%
- **Silver**: 60-79%
- **Failed**: <60% OR 2+ critical questions incorrect OR time exceeded

**Auto-fail conditions:**
1. Answering 2 or more critical questions incorrectly
2. Exceeding 1-hour time limit

### Styling System

Uses **styled-components v6** with TypeScript:
- Centralized theme in `styles/theme.ts` with tier-specific colors
- Transient props pattern (`$prop`) for styling-specific props that shouldn't reach the DOM
- Theme provider wraps app in `app/layout.tsx`
- Container queries for responsive certificate layout (uses `cqw` units)

Example tier-specific styling:
```typescript
theme.certificate.platinum.primary // '#a78bfa'
theme.certificate.gold.primary     // '#fbbf24'
theme.certificate.silver.primary   // '#94a3b8'
```

### Type Safety with Zod

All external data is validated with Zod:
- Question data from JSONL files
- LocalStorage operations (only participant name is persisted)
- User inputs

The Question schema includes all metadata fields for potential future features like question analytics or study guides.

### Path Aliases

The project uses `@/*` path alias (configured in tsconfig.json):
```typescript
import { loadQuestions } from '@/lib/questionLoader'
import type { Question } from '@/types/question'
```

## Deployment

The app is configured for **static export** (`output: 'export'` in next.config.ts) and automatically deploys to GitHub Pages via `.github/workflows/deploy.yml`.

The workflow:
1. Runs `npm run build` which exports to `./out` directory
2. Uploads the `./out` directory as a GitHub Pages artifact
3. Deploys to GitHub Pages

**Important**: If deploying to a subdirectory (e.g., `username.github.io/repo-name`), uncomment and set `basePath` in next.config.ts.

## Special Patterns

### Seeded Shuffling
Questions use a deterministic Fisher-Yates shuffle algorithm to ensure reproducible answer option order when a seed is provided (falls back to question ID-based seed).

### Timer Management
Time tracking uses `Date.now()` for accuracy instead of intervals. Visual warning appears when less than 5 minutes remain.

### Certificate Generation
Certificate IDs use format `CERT-{timestamp-base36}-{random-base36}` for collision-resistant unique identifiers.

### Confetti Celebrations
Tier-specific confetti configurations using `canvas-confetti`:
- **Platinum**: 5 particles, stars shape, 4000ms + special burst at 500ms
- **Gold**: 4 particles, circles, 3500ms
- **Silver**: 3 particles, circles, 3000ms

## Key Technologies

- **Next.js 16.0.0** with App Router and React Compiler enabled
- **React 19.2.0** with concurrent features
- **TypeScript 5** (strict mode)
- **Styled-Components 6.1.19** for CSS-in-JS
- **Zod 4.1.12** for runtime validation
- **Canvas Confetti 1.9.4** for celebration effects
- **Node.js >=22.0.0** (specified in package.json engines)

## Data Models

### Question Interface
```typescript
interface Question {
  id: string
  question: string
  options: string[]
  answer: number                          // Index of correct option
  importance: 'normal' | 'critical'
  topic_tags: string[]
  slide_ref: number | null
  vtt_timestamp: string
  bloom_level: string
  difficulty: string
}
```

### Certificate Result
```typescript
interface CertificateResult {
  participantName: string
  totalQuestions: number
  correctAnswers: number
  score: number                           // Percentage
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Failed'
  completedAt: Date
  certificateId: string
}
```

## Failure Categorization

The app tracks three distinct failure reasons:
- **'time'**: Exceeded 1-hour time limit
- **'critical'**: Failed 2+ critical questions
- **'score'**: Scored below 60%

Each has custom messaging in the Failure component.

## Linting

- Use a fix version of eslint when needed `npm run lint:fix`
- To test that everything works use `npm run build`