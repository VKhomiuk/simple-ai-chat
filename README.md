# AI Chat Interface

A modern, full-featured AI chat interface built with **Next.js 16**, **Vercel AI SDK v6**, **assistant-ui**, and the **Claude API** (Anthropic). Supports real-time streaming, rich Markdown rendering, model selection, file uploads (including `.docx` and `.xlsx`), and animated dark/light theme switching.

## Features

- **Streaming responses** — real-time token-by-token output from Claude
- **Model selector** — switch between Claude models (Sonnet 4.6, Opus 4.6, Haiku 4.5, etc.) inline in the composer
- **Markdown rendering** — full GFM support with copy-to-clipboard code blocks
- **File uploads** — images, documents (`.doc`, `.docx`, `.xls`, `.xlsx`, `.pdf`), and programming files
- **Document parsing** — `.docx` files extracted via mammoth, `.xlsx` sheets converted to CSV via xlsx
- **Image analysis** — send images (PNG, JPEG, GIF, WebP) for Claude to describe or reason about
- **Programming files** — upload `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, `.css`, `.html`, and many more
- **Stop generation** — cancel an in-progress response at any time
- **Dark/light theme** — toggle with animated transitions, persisted in localStorage
- **assistant-ui** — composable chat primitives with branch picking, message editing, copy, and refresh actions
- **Responsive UI** — clean design that works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root:

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
│   ├── api/chat/route.ts            # POST endpoint — streams Claude responses
│   ├── assistant.tsx                 # Client component — runtime provider, model state, header
│   ├── globals.css                   # Tailwind v4 theme variables (light/dark)
│   ├── layout.tsx                    # Root layout with Geist font + TooltipProvider
│   └── page.tsx                      # Renders the <Assistant /> component
├── components/
│   ├── assistant-ui/
│   │   ├── thread.tsx                # Full chat thread — messages, composer, welcome screen
│   │   ├── markdown-text.tsx         # Markdown renderer with GFM + code copy
│   │   ├── attachment.tsx            # File attachment UI — preview, remove, dialog
│   │   ├── tooltip-icon-button.tsx   # Reusable icon button with tooltip
│   │   └── tool-fallback.tsx         # Fallback UI for tool calls
│   ├── ui/
│   │   ├── button.tsx                # Button component (CVA variants)
│   │   ├── tooltip.tsx               # Radix tooltip primitives
│   │   ├── avatar.tsx                # Radix avatar primitives
│   │   └── dialog.tsx                # Radix dialog primitives
│   ├── model-selector.tsx            # Inline model picker in composer bar
│   ├── model-context.tsx             # React context for shared model state
│   └── theme-toggle.tsx              # Animated sun/moon theme toggle
└── lib/
    ├── attachment-adapter.ts         # Custom AttachmentAdapter for extended file types
    └── utils.ts                      # cn() helper (clsx + tailwind-merge)
```

## Supported File Types

| Category | Types |
|----------|-------|
| Images | PNG, JPEG, GIF, WebP |
| Documents | PDF, DOC, DOCX, XLS, XLSX |
| Text | Plain text, CSV, HTML, Markdown, JSON, XML |
| Code | JS, JSX, TS, TSX, CSS, SCSS, LESS, PY, RB, GO, RS, Java, C, C++, PHP, Swift, Kotlin, Shell, SQL, YAML, TOML |

## Available Models

| Model | Description |
|-------|-------------|
| Claude Sonnet 4.6 | Latest & fastest (default) |
| Claude Opus 4.6 | Most capable |
| Claude Opus 4.5 | Very capable |
| Claude Haiku 4.5 | Fast & cheap |
| Claude Sonnet 4.5 | Balanced |
| Claude Sonnet 4 | Reliable |
| Claude Opus 4 | Strong reasoning |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/) |

## Tech Stack

- **Next.js 16** — App Router, React Server Components
- **Vercel AI SDK v6** — `@ai-sdk/anthropic` provider + streaming
- **assistant-ui** — `@assistant-ui/react` + `@assistant-ui/react-ai-sdk` + `@assistant-ui/react-markdown`
- **Claude API** — multiple model support via Anthropic
- **Tailwind CSS v4** — utility-first styling with oklch color system
- **Radix UI** — accessible tooltip, dialog, avatar primitives
- **mammoth** — `.docx` text extraction
- **xlsx** — `.xlsx` spreadsheet parsing
- **lucide-react** — icon library

## License

MIT
