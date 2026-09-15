# CONTRACT NEGOTIATOR — PROJECT CONTEXT

> This file is the single source of truth for the project. Read it fully before making any change. Update it when anything significant changes.

---

## What This Project Is

A Bun + React + TypeScript web application that lets a user upload two PDF contracts, extract clause text from each, and use AI to identify conflicts and suggest compromise language. The app runs as a single Bun process — no separate frontend server, no Express, no Vite.

---

## Why This Exists — Two Goals

### Goal 1: Land a job at Genie AI
Genie AI (London, UK) is a legal AI startup backed by Google Ventures ($17.8M Series A). They build agentic contract drafting, review, and negotiation tools. This project is a working demo of a contract negotiation agent — a capability adjacent to but beyond what Genie AI currently ships. The plan is to cold email the CTO (Nitish Mutha) with a live demo link and a GitHub repo. The demo needs to be impressive, polished, and technically non-trivial.

### Goal 2: Potential India product
India's legaltech sector has 960 companies and raised $793M in funding with a 781% surge in 2025. The pain is real and validated:
- 15M+ freelancers in India with no affordable contract protection
- Indian freelance contracts routinely fail on TDS clauses, GST thresholds, and Section 44ADA
- Most SMBs sign contracts they don't understand
- Expensive lawyers (₹5,000–₹50,000 per contract review) are inaccessible to small businesses
- Platforms like SpotDraft serve enterprises — nobody serves the freelancer and SMB market well

If the product proves useful, it has a natural India market as a freemium SaaS targeting freelancers, early-stage startups, and small businesses.

---

## Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Bun | Not Node.js. Use bun, bun install, bun run |
| Language | TypeScript | Strict mode. No any without justification |
| Frontend | React 18 + TSX | Rendered via Bun's HTML import system |
| Styling | Plain CSS | index.css. No CSS frameworks |
| Server | Bun.serve() | No Express, no Fastify, no Hono |
| PDF Parsing | pdf-parse | PDFParse class pattern |
| AI | Gemini API (free tier) | Model fallback list — see below |
| Environment | Bun native .env | No dotenv import anywhere |
| Bundler | Bun native | No Vite, no Webpack, no esbuild |

---

## Project Structure

```
contract-negotiator/
├── index.ts              ← Bun.serve() — all routes live here
├── index.html            ← HTML shell — imports frontend.tsx
├── frontend.tsx          ← React UI — upload form + results
├── index.css             ← All styles
├── services/
│   ├── pdfParser.ts      ← PDF extraction + clause splitting
│   └── geminiService.ts  ← Gemini API call + model fallback
├── tsconfig.json         ← Includes DOM + DOM.Iterable libs
└── .env                  ← GEMINI_API_KEY and GEMINI_MODEL
```

---

## Current State

### What Works
- TypeScript compiles cleanly — `bun x tsc --project tsconfig.json --pretty false` exits 0
- Bun.serve() boots and serves the UI
- PDF parsing works using the PDFParse class pattern
- Frontend is stable — typed handlers, guarded root render, validated API response shape
- `/api/health` responds correctly
- `/api/negotiate` receives form data, parses both PDFs, extracts clauses
- AI provider migrated from Groq to Gemini — model fallback loop works correctly

### What Is Broken
Nothing is currently broken at P0 level. See Edge Cases Backlog for remaining P1–P3 items.

---

## Gemini Model Fallback List

Try models in this exact order:

```typescript
const DEFAULT_MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Serves index.html |
| POST | `/api/negotiate` | Accepts multipart/form-data with contractA and contractB PDF files |
| GET | `/api/health` | Returns `{"status":"ok"}` |

---

## Data Shapes

### Request (POST /api/negotiate)
```
multipart/form-data
  contractA: File (PDF)
  contractB: File (PDF)
```

### Response (success)
```typescript
type Conflict = {
  topic: string
  partyA: string
  partyB: string
  conflict: string
  compromise: string
  riskLevel: "low" | "medium" | "high"
  requiresLegalReview: boolean
}

type AnalysisResult = {
  conflicts: Conflict[]
  summary: string
}
```

### Response (error)
```typescript
{ error: string }
```

---

## Edge Cases Backlog

These are known issues not yet fixed. Fix them in priority order when scope allows:

| Priority | Issue | Location |
|---|---|---|
| ~~P0~~ | ~~Fallback loop throws instead of continues~~ | ~~groqService.ts~~ — **FIXED** (migrated to geminiService.ts) |
| P1 | JSON.parse of Gemini response not wrapped in try/catch | index.ts |
| P1 | Empty Gemini response not guarded | geminiService.ts |
| P2 | No user-facing error when PDF has no extractable text | pdfParser.ts + index.ts |
| P2 | No file size limit enforced on upload | index.ts |
| P3 | No loading state feedback beyond button text | frontend.tsx |
| P3 | No retry button on error | frontend.tsx |
| P3 | No skeleton loaders | frontend.tsx |

---

## Planned Features (Roadmap)

These are not yet built. Build them in order after the MVP is stable:

### Phase 2 — Polish (for Genie AI demo)
- Skeleton loaders instead of spinner text
- Retry button on error
- Clause count shown before analysis starts
- Copy to clipboard button on compromise suggestions
- Export results as PDF or markdown

### Phase 3 — India Market Features
- Single contract review mode (upload one contract, get risk analysis)
- Plain English explanation of each clause in Indian legal context
- TDS and GST clause detection and validation
- Indian jurisdiction selector (affects how risk is assessed)
- WhatsApp share button for results

### Phase 4 — Product Features
- User accounts and saved contract history
- Organisational playbook — save preferred clause language
- Multi-language support (Hindi, Kannada, Tamil)
- API access for developers

---

## Market Context (India)

Research from Reddit, Quora, and industry reports surfaces these validated pain points:

1. **Freelancers signing contracts they don't understand** — 15M+ freelancers, most have no legal support
2. **Wrong TDS clauses** — Section 194J vs 194C confusion costs freelancers money
3. **GST threshold errors** — ₹20L registration threshold mishandled in contracts
4. **Auto-renewal traps** — small businesses locked into vendor contracts they forgot renewed
5. **Payment dispute language** — vague payment terms lead to the most common disputes
6. **IP ownership ambiguity** — especially in tech freelancing, who owns the code
7. **Scope creep** — no change request process defined in contracts
8. **Jurisdiction confusion** — which court, which state, which law applies

These are the clause categories the AI should prioritise flagging.

---

## Environment Variables

```env
GEMINI_API_KEY=<never log or expose this>
GEMINI_MODEL=gemini-3.6-flash
```

Bun loads `.env` automatically. Never import dotenv.

---

## How to Run

```bash
bun install
bun --hot index.ts
```

Open `http://localhost:3000`

---

## How to Type Check

```bash
bun x tsc --project tsconfig.json --pretty false
```

Must exit with code 0 and zero errors at all times.

