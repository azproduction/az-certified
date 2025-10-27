# Deployment Guide

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create an `out` directory with the static files ready for deployment.

## GitHub Pages Deployment

### Option 1: Using GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Source: GitHub Actions

### Option 2: Manual Deployment

1. Build the project: `npm run build`
2. The `out` folder contains your static site
3. Push the `out` folder to the `gh-pages` branch

### Custom Domain / Subdirectory

If deploying to a subdirectory (e.g., `username.github.io/repo-name`):

1. Update `next.config.ts`:
```typescript
basePath: '/repo-name',
```

2. Rebuild the project

## Local Testing

To test the production build locally:

```bash
# Build the project
npm run build

# Serve the out directory (using any static server)
npx serve out
```

## Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ 50 questions randomly selected (all critical + random normal)
- ✅ 1-hour time limit
- ✅ Progress tracking with prev/next navigation
- ✅ Mobile-friendly responsive design
- ✅ Participant name persisted in localStorage
- ✅ Session lost on browser close (no resume)
- ✅ Auto-fail on time expiry or ≥2 critical questions wrong
- ✅ Certificate with confetti animation (Silver/Gold/Platinum)
- ✅ Questions embedded in JS bundle at build time
- ✅ Static export ready for GitHub Pages

## Technologies

- Next.js 16 with React 19
- TypeScript
- Styled Components
- Zod (localStorage validation)
- Canvas Confetti (certificate animation)
