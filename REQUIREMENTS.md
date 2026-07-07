# Requirements

---

## Backend (`backend/package.json`)

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.19.2 | HTTP server and REST API routing |
| `multer` | ^1.4.5-lts.1 | Multipart form handling for PDF uploads (in-memory storage) |
| `pdf-parse` | ^1.1.1 | Extract plain text from PDF file buffers |
| `groq-sdk` | ^1.3.0 | Groq API client — runs Llama 3.3 70B for claim extraction and verdict generation |
| `@tavily/core` | ^0.7.6 | Tavily Search API client — live web search for claim verification |
| `axios` | ^1.7.2 | HTTP client for external API calls |
| `cors` | ^2.8.5 | Enable cross-origin requests from the React frontend |
| `dotenv` | ^16.4.5 | Load environment variables from `.env` file |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `nodemon` | ^3.1.4 | Auto-restart server on file changes during development |

### Install

```bash
cd backend
npm install
```

---

## Frontend (`frontend/package.json`)

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.7 | UI component library |
| `react-dom` | ^19.2.7 | React DOM renderer |
| `axios` | ^1.18.1 | HTTP client (available, fetch used directly in App.jsx) |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^8.1.1 | Build tool and dev server with HMR |
| `@vitejs/plugin-react` | ^6.0.3 | React JSX transform and Fast Refresh for Vite |
| `eslint` | ^10.6.0 | JavaScript linter |
| `eslint-plugin-react-hooks` | ^7.1.1 | Lint React hooks usage |
| `eslint-plugin-react-refresh` | ^0.5.3 | Lint React Fast Refresh compatibility |
| `globals` | ^17.7.0 | Global variable definitions for ESLint |
| `@types/react` | ^19.2.17 | TypeScript types for React (used by IDE tooling) |
| `@types/react-dom` | ^19.2.3 | TypeScript types for React DOM |

### Install

```bash
cd frontend
npm install
```

---

## Install Everything at Once

```bash
cd backend && npm install
cd ../frontend && npm install
```
