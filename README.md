# ✍️ WriteAI — Blog Post Generator

A modern SaaS-style Blog Post Generator built with **React + Vite + Tailwind CSS**, powered by the **Anthropic Claude API**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run the dev server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
blog-generator/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── BlogGenerator.jsx   ← Main UI component
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| lucide-react | Icons |
| Anthropic API | AI content generation |

---

## 🎨 Features

- **Full-screen SaaS dashboard layout** with collapsible sidebar
- **Dark slate sidebar** with navigation items + Pro upgrade card
- **Left card** — Blog topic input, Tone selector, Length selector
- **Right card** — Live preview with loading animation + formatted output
- **AI-powered** — Calls Claude claude-sonnet-4-20250514 via Anthropic API
- **Mobile responsive** — Sidebar toggles on small screens
- **Error handling** — Graceful error state in the preview card
- **Reset button** — Clear and start over after generation

---

## ⚙️ Build for Production

```bash
npm run build
npm run preview
```

---

## 📝 Notes

- The Anthropic API key is handled by the claude.ai artifact environment.
- If running outside claude.ai, add your API key to the fetch headers:
  ```js
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY",
    "anthropic-version": "2023-06-01",
  }
  ```
- Always review AI-generated content before publishing.
