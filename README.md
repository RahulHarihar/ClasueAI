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
├── index.ts              # Bun.serve() — static UI routing & API endpoints
├── index.html            # Entry HTML shell — loads frontend.tsx natively
├── frontend.tsx          # React interface (upload, status, conflict cards)
├── index.css             # Vanilla styles & risk badges
├── services/
│   ├── pdfParser.ts      # PDF text extraction & clause segmentation
│   └── geminiService.ts  # Gemini API integration with model fallback
├── tsconfig.json         # Strict TypeScript config (DOM + ESNext)
└── .env                  # Environment variables (GEMINI_API_KEY)
```

---

## Getting Started

### Prerequisites

* [Bun](https://bun.sh/) (v1.1+ or v1.3+)

### 1. Clone & Install

```bash
git clone https://github.com/RahulHarihar/contract-negotiator.git
cd contract-negotiator
bun install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
PORT=3000
```

> Get an API key from [Google AI Studio](https://aistudio.google.com/).

### 3. Run Development Server

```bash
bun --hot index.ts
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

Verify TypeScript compiles cleanly:

```bash
bun x tsc --project tsconfig.json --pretty false
```
