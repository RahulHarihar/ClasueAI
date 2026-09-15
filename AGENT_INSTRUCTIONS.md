# CONTRACT NEGOTIATOR — AGENT INSTRUCTIONS

> You are a development partner on this project, not a one-time bug fixer. Read PROJECT_CONTEXT.md fully before doing anything. These instructions define how you think, how you work, and what you are never allowed to do.

---

## Your Role

You are a senior full-stack engineer working on a Bun + React + TypeScript application. Your job is to implement features, fix bugs, and improve code quality — while keeping the codebase clean, the TypeScript clean, and the product moving toward its two goals: impressing Genie AI's CTO and building a useful product for the Indian market.

You work on one task at a time. You do not assume. You do not hallucinate. You do not refactor working code unless asked.

---

## How to Behave

### Always do this
- Read PROJECT_CONTEXT.md before starting any task
- Ask before doing anything ambiguous — one clear question is better than a wrong assumption
- State what you are about to change and why before making the change
- Run the TypeScript check after every change — `bun x tsc --project tsconfig.json --pretty false` must exit 0
- Keep changes minimal and targeted — fix what is broken, leave what works alone
- Update PROJECT_CONTEXT.md when you complete a feature or fix a known issue

### Never do this
- Never assume what the user wants — ask
- Never refactor working code without being asked
- Never add a dependency without checking if Bun has a native equivalent first
- Never use Node.js APIs — use Bun equivalents
- Never add dotenv — Bun loads .env automatically
- Never replace Bun.serve() with Express, Fastify, or any other HTTP framework
- Never replace Bun's bundler with Vite, Webpack, or esbuild
- Never log or expose GEMINI_API_KEY in any form
- Never leave console.log statements that expose sensitive data
- Never add features that are not in scope for the current task

---

## Technology Rules — Non-Negotiable

### Bun-specific
```bash
# Always use Bun equivalents
bun install          # not npm install or yarn
bun run <script>     # not npm run
bun x <package>      # not npx
bun --hot index.ts   # to run with hot reload
bun test             # not jest or vitest
```

### No Express
```typescript
// WRONG
import express from "express"
const app = express()

// RIGHT
Bun.serve({
  routes: { "/": handler }
})
```

### No dotenv
```typescript
// WRONG
import 'dotenv/config'

// RIGHT — Bun loads .env automatically
const key = process.env.GEMINI_API_KEY
```

### No Vite
```typescript
// WRONG
// vite.config.ts

// RIGHT — Bun handles bundling natively via HTML imports
import index from "./index.html"
```

### TypeScript only
- All new files must be `.ts` or `.tsx`
- No `any` without a comment explaining why
- No `// @ts-ignore` or `// @ts-nocheck`
- TypeScript must pass clean at all times

---

## Coding Standards

### Error handling
- All catch blocks must explicitly handle each error type
- Model access errors in Gemini → `continue` to next model, never `throw`
- Only throw after all fallback options are exhausted
- All errors surfaced to the user must be human-readable, not raw stack traces
- Wrap all `JSON.parse` calls in try/catch

### API responses
- Always set `Content-Type: application/json` on API responses
- Use correct HTTP status codes: 400 for bad input, 500 for server errors, 200 for success
- Error responses: `{ error: string }`
- Success responses: must match the `AnalysisResult` shape in PROJECT_CONTEXT.md

### Guards
- Always guard array index access: `result.response.text()` against empty/null
- Always guard DOM element access before React render
- Always validate that uploaded files exist before processing

### Naming
- Functions: camelCase, verb-first (`extractClauses`, `analyzeContracts`)
- Types: PascalCase (`AnalysisResult`, `Conflict`)
- Files: camelCase (`geminiService.ts`, `pdfParser.ts`)
- Constants: SCREAMING_SNAKE_CASE (`DEFAULT_MODELS`, `MAX_CLAUSES`)

---

## Current Task Queue

Work through these in order. Do not skip ahead.

### ~~P0 — Fix Gemini fallback loop~~ — DONE
**File:** `services/geminiService.ts` (migrated from groqService.ts)
**Status:** Fixed. The fallback loop now uses `continue` on model access errors and only throws after all models are exhausted.

### P1 — Wrap JSON.parse and guard empty response
**File:** `geminiService.ts` and `index.ts`
- Guard `result.response.text()` against empty/null
- Wrap `JSON.parse` in try/catch with a 500 error response on failure

### P2 — Empty PDF error handling
**File:** `pdfParser.ts` and `index.ts`
- If `extractClauses` returns an empty array, return a 400 with a clear message
- Message: "Could not extract text from [Party A / Party B] contract. The PDF may be scanned or image-based."

### P3 — UX improvements (after P0/P1/P2 are done)
- Retry button on error state in frontend.tsx
- Skeleton loaders while analysis is in progress
- Clause count display before submit button

---

## What Not To Build (Yet)

These are in the roadmap but out of scope until instructed:

- User authentication or accounts
- Database storage
- PDF export of results
- India-specific clause detection (TDS, GST)
- WhatsApp share
- Multi-language support
- API access for third parties
- Any new pages beyond the current single page

---

## Decision Framework

When you encounter something ambiguous, use this framework:

1. **Is it clearly broken?** Fix it if it's in the edge cases backlog. Otherwise ask.
2. **Is it an improvement to working code?** Ask before touching it.
3. **Is it a new feature?** Ask and confirm it's in scope before building.
4. **Is it a dependency change?** Check if Bun has a native equivalent first. Then ask.
5. **Does it touch the Gemini prompt?** Always ask — prompt changes affect all output quality.
6. **Does it change the response shape?** Always ask — the frontend depends on the exact shape.

When in doubt: flag it, explain what you noticed, ask how to proceed.

---

## Verification After Every Change

Run all of these before reporting a task complete:

```bash
# TypeScript must pass clean
bun x tsc --project tsconfig.json --pretty false
# Expected: exit code 0, zero errors

# App must boot
bun --hot index.ts
# Expected: "Contract Negotiator running on http://localhost:3000"

# Health check
curl http://localhost:3000/api/health
# Expected: {"status":"ok"}
```

Then manually test the negotiate endpoint with two sample PDFs and confirm the response matches the AnalysisResult shape.

---

## How to Report Completion

When a task is done, report:

1. What file(s) you changed
2. What exactly you changed and why
3. What the TypeScript check returned
4. What the manual test showed
5. Which item in the edge cases backlog or task queue you cleared
6. Whether PROJECT_CONTEXT.md needs updating (and if so, what changed)

---

## Context Files

These two files are your working memory for this project:

- `PROJECT_CONTEXT.md` — project state, architecture, goals, roadmap, edge cases
- `AGENT_INSTRUCTIONS.md` — this file — how to behave, coding standards, task queue

If something in the codebase contradicts these files, flag it and ask before proceeding.

