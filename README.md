# Clarifact

**🔗 Live Demo → [clarifact-three.vercel.app](https://clarifact-three.vercel.app)**

An automated fact-checking web app that reads a PDF, extracts every verifiable claim, cross-references each one against live web data, and flags inaccuracies with corrections and sources.

Built as a "Truth Layer" for marketing content, research documents, or any PDF that may contain outdated or hallucinated statistics.

---

## What it does

1. **Extract** — AI scans the uploaded PDF and identifies specific, verifiable claims: statistics, percentages, monetary figures, dates, named entities with attributed facts, and record-breaking statements.
2. **Verify** — Each claim is searched against live web data using Tavily Search API.
3. **Report** — Every claim is labeled with one of four verdicts:
   - ✅ **Verified** — claim matches evidence
   - ⚠️ **Inaccurate** — claim is wrong or outdated, correct value provided
   - ❌ **False** — claim is directly contradicted by sources
   - ❓ **Unverifiable** — insufficient evidence found

---

## Tech Stack

### Backend
| Package | Purpose |
|---|---|
| `express` | HTTP server and routing |
| `multer` | PDF file upload handling (in-memory) |
| `pdf-parse` | Extract raw text from PDF buffers |
| `groq-sdk` | LLM inference via Groq (Llama 3.3 70B) — free tier |
| `@tavily/core` | Live web search for claim verification — free tier |
| `axios` | HTTP client |
| `cors` | Cross-origin requests from frontend |
| `dotenv` | Environment variable management |
| `nodemon` | Auto-restart during development |

### Frontend
| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `vite` | Build tool and dev server |
| `axios` | HTTP client |

---

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── index.js                  # Express server entry point
│   │   ├── routes/
│   │   │   └── factcheck.js          # POST /api/fact-check endpoint
│   │   └── services/
│   │       ├── pdfExtractor.js       # PDF → plain text (pdf-parse)
│   │       ├── claimExtractor.js     # Text → claims list (Groq / Llama 3.3)
│   │       ├── webSearch.js          # Claim → web evidence (Tavily)
│   │       └── factChecker.js        # Evidence → verdict (Groq / Llama 3.3)
│   ├── .env                          # Your API keys (never commit this)
│   ├── .env.example                  # Template for required env vars
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # Root component, state management
│   │   ├── index.css                 # Global styles + CSS variables
│   │   └── components/
│   │       ├── UploadSection.jsx     # PDF drag-and-drop upload + hero
│   │       ├── LoadingState.jsx      # Animated progress during analysis
│   │       ├── ResultsDashboard.jsx  # Summary stats + accuracy score ring
│   │       └── ClaimCard.jsx         # Expandable per-claim detail row
│   ├── vite.config.js                # Vite config + /api proxy to backend
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A **Groq** API key (free) — [console.groq.com](https://console.groq.com)
- A **Tavily** API key (free) — [app.tavily.com](https://app.tavily.com)

---

## Setup & Running Locally

### 1. Clone / download the project

```bash
cd project
```

### 2. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your keys:

```env
GROQ_API_KEY=gsk_your_groq_key_here
TAVILY_API_KEY=tvly-your_tavily_key_here
PORT=8000
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

### 5. Run both servers

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Server starts at `http://localhost:8000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
App opens at `http://localhost:5173`

---

## API Reference

### `POST /api/fact-check`

Upload a PDF for fact-checking.

**Request:** `multipart/form-data` with field `file` (PDF, max 20MB)

**Response:**
```json
{
  "total_claims": 8,
  "summary": {
    "verified": 3,
    "inaccurate": 2,
    "false": 1,
    "unverifiable": 2
  },
  "claims": [
    {
      "claim": "Apple became the first company to reach a $3 trillion market cap in 2022",
      "context": "Surrounding sentence from the document...",
      "verdict": "Inaccurate",
      "explanation": "Apple crossed $3 trillion briefly in January 2022 but the milestone was first sustained in 2023.",
      "correction": "Apple first sustained a $3 trillion market cap in June 2023.",
      "sources": ["https://example.com/source"]
    }
  ]
}
```

### `GET /health`

Returns `{ "status": "ok" }` — used to verify the server is running.

---

## Free Tier Limits

| Service | Free Limit | Notes |
|---|---|---|
| Groq | 12,000 tokens/min, 14,400 tokens/day | Llama 3.3 70B — claims processed sequentially with 3s delay to stay within limits |
| Tavily | 1,000 searches/month | 5 results per claim search |

---

