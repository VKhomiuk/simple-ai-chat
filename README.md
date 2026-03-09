# AI Chat Interface

A modern, full-featured AI chat interface built with **Next.js 16**, **Vercel AI SDK v6**, and the **Claude API** (Anthropic). The app supports real-time streaming responses, rich Markdown rendering with syntax-highlighted code blocks, file and image uploads for multimodal conversations, and automatic dark mode.

## Features

- **Streaming responses** — real-time token-by-token output from Claude via Server-Sent Events
- **Markdown rendering** — full GitHub Flavored Markdown (GFM) support including tables, task lists, blockquotes, and headings
- **Syntax highlighting** — code blocks with language detection, one-dark theme, and a one-click copy button
- **File uploads** — attach images, PDFs, and text-based files for Claude to analyze (up to 20 MB per file)
- **Image analysis** — send images (PNG, JPEG, GIF, WebP) and ask Claude to describe or reason about them
- **Stop generation** — cancel an in-progress response at any time
- **Dark mode** — automatic system preference detection with custom scrollbar styling
- **Responsive UI** — clean, modern design that works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts        # POST endpoint — streams Claude responses
│   ├── globals.css               # Tailwind imports + custom scrollbar/dark mode styles
│   ├── layout.tsx                # Root layout with Geist font
│   └── page.tsx                  # Renders the <Chat /> component
├── components/
│   ├── chat.tsx                  # Main chat UI — input, messages list, file attach
│   ├── chat-message.tsx          # Single message bubble (user / assistant)
│   ├── file-upload.tsx           # File picker + preview chips with remove button
│   └── markdown-renderer.tsx     # react-markdown with custom component overrides
└── lib/
    └── utils.ts                  # cn() helper (clsx + tailwind-merge)
```

## Supported File Types

| Category | Types |
|----------|-------|
| Images | PNG, JPEG, GIF, WebP |
| Documents | PDF |
| Text | Plain text, CSV, HTML, Markdown, JSON |

Max file size: **20 MB**

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/) |

## Tech Stack

- **Next.js 16** — App Router, React Server Components
- **Vercel AI SDK v6** — `@ai-sdk/anthropic` provider + `@ai-sdk/react` hooks
- **Claude Sonnet** — Anthropic's `claude-sonnet-4-20250514` model
- **Tailwind CSS v4** — utility-first styling
- **react-markdown** + **remark-gfm** — Markdown rendering with GFM extensions
- **react-syntax-highlighter** — Prism-based code block highlighting
- **lucide-react** — icon library

## License

MIT
