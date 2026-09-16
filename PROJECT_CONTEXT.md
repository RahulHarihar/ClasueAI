# CONTRACT NEGOTIATOR — PROJECT CONTEXT

> This file is the single source of truth for the project. Read it fully before making any change. Update it when anything significant changes.

---

## What This Project Is

A full-stack contract negotiation assistant split into a **Next.js (App Router) frontend** and a **Bun API backend**:
- **Frontend:** Next.js + React 19 + TypeScript + Tailwind CSS (deployed to Vercel with zero config).
- **Backend:** Bun.serve() + TypeScript + PDF parsing + Gemini API (deployed to Render with Bun runtime).

---

## Deployment Targets
- **Frontend:** Vercel (root: `frontend/`)
- **Backend:** Render (root: `backend/`, blueprint: `backend/render.yaml`)

---

## Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend Runtime | Bun | Runs `backend/index.ts` with `Bun.serve()` |
| Backend Language | TypeScript | Strict mode |
| Frontend Framework| Next.js 15 (App Router) | Located in `frontend/`, deploys to Vercel |
| Frontend Styling | Tailwind CSS | Dark theme (#0f0f0f, #1a1a1a) |
| PDF Parsing | pdf-parse | In `backend/services/pdfParser.ts` |
| AI Service | Google Gemini API | In `backend/services/geminiService.ts` |
| Backend Hosting | Render | Configured via `backend/render.yaml` |
| Frontend Hosting| Vercel | Zero-config Next.js deployment |

---

## Project Structure

```
contract-negotiator/
├── backend/
│   ├── index.ts              ← Bun.serve() — /api/negotiate & /api/health with CORS
│   ├── services/
│   │   ├── geminiService.ts  ← Gemini API integration + model fallback loop
│   │   └── pdfParser.ts      ← PDF text extraction & clause segmentation
│   ├── package.json          ← Backend dependencies & scripts
│   ├── tsconfig.json         ← Backend TypeScript configuration
│   ├── render.yaml           ← Render deployment blueprint
│   ├── .env.example          ← GEMINI_API_KEY, GEMINI_MODEL, FRONTEND_URL
│   └── .env                  ← Local environment secrets (git ignored)
├── frontend/
│   ├── app/
│   │   ├── layout.tsx        ← Root layout, metadata & dark background
│   │   ├── page.tsx          ← Main dashboard page
│   │   └── globals.css       ← Tailwind directives & root CSS variables
│   ├── components/
│   │   ├── UploadForm.tsx    ← Dual PDF upload form calling Render backend
│   │   ├── ConflictCard.tsx  ← Conflict comparison card with risk badges
│   │   └── LoadingState.tsx  ← Spinner + 3s cold start notification
│   ├── types/
│   │   └── index.ts          ← RiskLevel, Conflict, and AnalysisResult types
│   ├── next.config.ts        ← Next.js configuration
│   ├── package.json          ← Frontend dependencies (Next.js, Tailwind, React 19)
│   ├── tsconfig.json         ← Frontend TypeScript configuration
│   ├── tailwind.config.ts    ← Tailwind dark mode configuration
│   ├── postcss.config.mjs    ← PostCSS configuration
│   ├── .env.example          ← NEXT_PUBLIC_API_URL
│   └── .env.local            ← Local dev API URL (git ignored)
├── PROJECT_CONTEXT.md
├── AGENT_INSTRUCTIONS.md
├── README.md
└── .gitignore
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

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=<never log or expose this>
GEMINI_MODEL=gemini-3.6-flash
PORT=3000
FRONTEND_URL=http://localhost:3001
```

### Frontend (`frontend/.env.local` / Vercel Environment)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## How to Run

### Run Backend (Port 3000)
```bash
cd backend
bun install
bun --hot index.ts
```

### Run Frontend (Port 3001 or default 3000)
```bash
cd frontend
bun install
bun run dev -- -p 3001
```

---

## How to Type Check

Must exit with code 0 and zero errors in both directories:

```bash
# Type check backend
cd backend
bun x tsc --project tsconfig.json --pretty false

# Type check frontend
cd frontend
bun x tsc --noEmit
```

