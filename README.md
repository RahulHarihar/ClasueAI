# Contract Negotiator

A lightweight, single-process tool to compare two contract versions, spot conflicting clauses, and generate fair compromise language.

Built with **Bun + React + TypeScript + Google Gemini**.

---

## Why this exists

When two parties negotiate an agreement (vendor contracts, freelance agreements, NDAs, MSAs), each side usually sends their own draft or redline. Comparing them manually clause-by-clause is tedious, error-prone, and expensive.

This tool automates the initial pass:
1. Extracts clauses from two uploaded PDF contracts.
2. Identifies substantive conflicts (payment timelines, liability caps, IP ownership, governing law).
3. Rates risk level (`low`, `medium`, `high`) and flags clauses requiring human legal review.
4. Generates compromise language that balances both parties' interests.

---

## Architecture

The entire stack runs inside a **single Bun process** — no Express, no Vite, and no separate frontend dev server.

```
                    ┌─────────────────────────┐
                    │       Client (Web)      │
                    └────────────┬────────────┘
                                 │ POST /api/negotiate (multipart PDFs)
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Bun Runtime (index.ts)                                      │
│                                                             │
│  ├── Serves bundled React UI via native HTML imports        │
│  ├── Extracts PDF text & splits clauses (services/pdfParser)│
│  └── Calls Gemini with structured JSON output               │
│      (services/geminiService)                               │
└────────────────────────────────┬────────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Google Gemini API    │
                    │  (3.6-flash → 3.5-flash)│
                    └─────────────────────────┘
```

### Resilient Model Fallback

Free-tier and preview AI models frequently deprecate, rate-limit, or encounter transient spikes (`503` / `404`). The Gemini service implements an automatic fallback pipeline:

```
gemini-3.6-flash (primary) ──► gemini-3.5-flash ──► gemini-3.5-flash-lite
```

If the primary model is unavailable, the service catches access/capacity errors and advances to the next model in sequence rather than failing the request.

---

## Project Structure

```
contract-negotiator/
├── backend/
│   ├── index.ts              # Bun.serve() — /api/negotiate & /api/health with CORS
│   ├── services/
│   │   ├── geminiService.ts  # Gemini API integration with model fallback
│   │   └── pdfParser.ts      # PDF text extraction & clause segmentation
│   ├── package.json          # Backend runtime & dependencies
│   ├── tsconfig.json         # Backend TypeScript config
│   ├── render.yaml           # Render deployment blueprint
│   └── .env.example          # GEMINI_API_KEY, GEMINI_MODEL, FRONTEND_URL
├── frontend/
│   ├── app/
│   │   ├── layout.tsx        # Next.js App Router root layout & dark theme
│   │   ├── page.tsx          # Main upload & analysis dashboard
│   │   └── globals.css       # Tailwind CSS directives
│   ├── components/
│   │   ├── UploadForm.tsx    # PDF upload form connecting to backend API
│   │   ├── ConflictCard.tsx  # Clause comparison card with risk badges
│   │   └── LoadingState.tsx  # Spinner & cold-start notice
│   ├── types/
│   │   └── index.ts          # Conflict and AnalysisResult TypeScript types
│   ├── next.config.ts        # Next.js configuration
│   ├── package.json          # Frontend dependencies (Next.js, Tailwind, React 19)
│   ├── tsconfig.json         # Frontend TypeScript config
│   └── .env.example          # NEXT_PUBLIC_API_URL
├── PROJECT_CONTEXT.md
└── AGENT_INSTRUCTIONS.md
```

---

## Getting Started

### Prerequisites

* [Bun](https://bun.sh/) (v1.1+ or v1.3+)

### 1. Run the Backend (Render / Bun)

```bash
cd backend
bun install
cp .env.example .env # Add your GEMINI_API_KEY
bun --hot index.ts
```

Backend runs at [http://localhost:3000](http://localhost:3000).

### 2. Run the Frontend (Vercel / Next.js)

```bash
cd frontend
bun install
cp .env.example .env.local # Set NEXT_PUBLIC_API_URL=http://localhost:3000
bun run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## API Reference

### `POST /api/negotiate`

Accepts `multipart/form-data` containing two PDF files:
* `contractA`: First contract file (`.pdf`)
* `contractB`: Second contract file (`.pdf`)

**Response (`200 OK`):**
```json
{
  "conflicts": [
    {
      "topic": "Payment Terms",
      "partyA": "Payment due within 30 days of invoice.",
      "partyB": "Payment due within 60 days of invoice.",
      "conflict": "Dispute between 30-day cash flow requirements and 60-day AP cycles.",
      "compromise": "Payment due within 45 days of invoice date.",
      "riskLevel": "low",
      "requiresLegalReview": false
    }
  ],
  "summary": "Primary conflict revolves around commercial payment terms (Net 30 vs Net 60)."
}
```

### `GET /api/health`

Returns health status:
```json
{ "status": "ok" }
```

---

## Verification & Testing

Verify TypeScript compiles cleanly across both packages:

```bash
# Typecheck backend
cd backend
bun x tsc --project tsconfig.json --pretty false

# Typecheck frontend
cd frontend
bun x tsc --noEmit
```
