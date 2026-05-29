# ✍️ ContientAI — Next.js + Ollama Blog Generator

A fully local, privacy-first Blog Post Generator built with **Next.js 14 App Router + Tailwind CSS**, powered by **Ollama** running on your machine.

---

## 🏗 Project Structure

```
contientAI-nextjs/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   └── route.ts      ← STEP 1-4: Ollama API route
│   │   │   └── models/
│   │   │       └── route.ts      ← List available models
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── BlogGenerator.tsx     ← Main UI
│   │   ├── BlogPreview.tsx       ← Markdown renderer
│   │   ├── Select.tsx            ← Custom dropdown
│   │   └── StatusBadge.tsx       ← Ollama health indicator
│   ├── hooks/
│   │   └── useBlogGenerator.ts  ← Custom hook (fetch + state)
│   └── lib/
│       ├── ollama.ts             ← Ollama client + error classes
│       └── prompts.ts            ← Prompt builders
├── .env.local                    ← Your config (never commit)
├── .env.example                  ← Safe template to commit
└── next.config.js
```

---

## 🚀 Quick Start

### Step 1 — Install & start Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Start the Ollama server
ollama serve

# Pull a model (in another terminal)
ollama pull llama3        # recommended ~4.7GB
# or
ollama pull mistral       # ~4.1GB
ollama pull phi3          # ~2.3GB (fastest)
ollama pull gemma2        # ~5.5GB
```

### Step 2 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

### Step 3 — Install dependencies

```bash
npm install
```

### Step 4 — Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints

### `POST /api/generate`
Generate a blog post.

**Request body:**
```json
{
  "topic": "10 Ways to Boost Productivity",
  "tone": "professional",
  "length": "medium",
  "model": "llama3"
}
```

**Success response:**
```json
{
  "success": true,
  "content": "# 10 Ways to Boost Productivity\n\n...",
  "model": "llama3",
  "wordCount": 1187,
  "generationMs": 12400
}
```

**Error response:**
```json
{
  "success": false,
  "error": "Model \"llama3\" is not available.",
  "code": "MODEL_NOT_FOUND",
  "hint": "Run: ollama pull llama3"
}
```

**Error codes:**
| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Missing or invalid input fields |
| `CONNECTION_ERROR` | Ollama server not running |
| `MODEL_NOT_FOUND`  | Model not pulled yet |
| `TIMEOUT`          | Generation took too long |
| `API_ERROR`        | Ollama returned an error |
| `UNKNOWN_ERROR`    | Unexpected server error |

### `GET /api/generate`
Health check — returns Ollama status + available models.

### `GET /api/models`
Returns list of all locally available models.

---

## ⚙️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3` | Default model |

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | Full-stack React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Ollama | Local LLM runtime |
| lucide-react | Icons |

---

## 🔒 Privacy

All content is generated **100% locally** on your machine. No data is sent to any external API or cloud service.
