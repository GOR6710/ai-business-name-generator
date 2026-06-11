# AI Business Name Generator

Generate unique, creative business names instantly with AI.

## Features
- 15 name ideas per generation
- Memorability, Pronounceability & Brandability scores
- Taglines for each name
- Domain availability check
- Favorites system
- Industry & Style filters

## Tech Stack
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- OpenAI GPT-4o-mini
- Neon PostgreSQL + Prisma

## Setup

```bash
# Install dependencies
npm install

# Copy env and fill in values
cp .env.example .env.local

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Run dev server
npm run dev
```

## Environment Variables
```
DATABASE_URL=      # Neon PostgreSQL connection string
OPENAI_API_KEY=    # OpenAI API key
```

## Deploy
Push to GitHub → Import on Vercel → Set env vars → Deploy
