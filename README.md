<div align="center">

# Tailwind Editor

### AI-Powered Visual Editor for Tailwind CSS

Build, design, and edit web interfaces visually with real-time preview, drag-and-drop blocks, and an integrated AI assistant.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## ✨ Features

- [x] **Visual Editor** — Click-to-select elements in a live iframe preview. Inspect and modify properties visually.
- [x] **Preview Mode** — Switch to a pure preview without editor controls.
- [x] **Double-click to Code** — Double-click any element in the visual canvas to jump directly to its code.
- [x] **AI Assistant (BYOK)** — Integrated chat panel powered by Google Gemini. Bring your own API key.
- [x] **Code Editor** — Monaco-powered code editor with Emmet support, syntax highlighting, and live sync.
- [x] **Drag & Drop (DND) Blocks** — Pre-built component blocks you can drag into your design.
- [x] **Tailwind CSS v4** — Built-in support for Tailwind CSS v4.
- [x] **Tailwind Properties Panel** — Visual controls for layout, spacing, typography, colors, borders, and more.
- [x] **Responsive Preview** — Switch between mobile, tablet, laptop, desktop, and TV breakpoints.
- [x] **AI Settings** — Configure model, system prompt, temperature, topP, topK, and max tokens directly from the UI.
- [x] **Multi-Select** — Select multiple elements and batch-edit their properties.
- [x] **Undo/Redo** — Full undo/redo history via Monaco editor integration.
- [x] **Import/Export** — Import HTML files and export clean code (without builder metadata).
- [x] **Dark Mode** — Full light/dark theme support.
- [ ] **Pages Management** — Create and manage multiple pages, routes, and dynamic templates.
- [ ] **Drag & Drop (DND) Page Builder** — Build entire pages visually with advanced drag-and-drop mechanics.
- [ ] **Assets Management** — Upload, organize, and manage images, videos, and documents.
- [ ] **Layers Panel (AST)** — View and rearrange the DOM tree structure visually.
- [ ] **Share & Collaboration** — Share your designs via unique links and collaborate in real-time.
- [ ] **PWA Support** — Install the editor as a Progressive Web App.
- [ ] **AI Agents** — Autonomous agents for building entire sections or refactoring code.
- [ ] **Cloud Saving** — Save projects to a backend database.
- [ ] **Tailwind CSS v3 & Vanilla CSS** — Future integration for Tailwind v3 and standard Vanilla CSS properties.

---

## 🔑 Bring Your Own Key (BYOK)

Tailwind Editor uses a **Bring Your Own Key** model for AI features:

1. **Get a free API key** from [Google AI Studio](https://aistudio.google.com/apikey)
2. **Open Settings** (⚙️ icon in the top bar or AI panel)
3. **Paste your key** — it's encrypted with AES-256 and stored locally in your browser
4. **Start building** — AI calls go directly from your browser to Google's API

> **🔒 Privacy**: Your API key is never sent to any server. It's encrypted using the Web Crypto API and stored in your browser's localStorage. All AI calls are made directly from your browser to Google's Gemini API.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ or [Bun](https://bun.sh/) 1.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/prabhatpushp/tailwindeditor.git
cd tailwindeditor

# Install dependencies
bun install
# or
npm install

# Start the development server
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **No `.env` setup required!** API keys are configured in the browser via Settings (BYOK model).



## 🏗️ Project Structure

```
tailwindeditor/
├── app/
│   ├── api/chat/          # AI chat API route (server-side)
│   ├── globals.css         # Global styles & Tailwind theme
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Main editor page
├── components/
│   ├── editor/             # Core editor components
│   │   ├── top-bar.tsx     # Toolbar with tools, breakpoints, undo/redo
│   │   ├── left-panel.tsx  # AI assistant + blocks panel
│   │   ├── editor-panel.tsx# Monaco code editor + iframe preview
│   │   ├── properties-panel.tsx # Design/assets/pages tabs
│   │   ├── properties/     # Property editor components
│   │   │   ├── ai-assist-panel.tsx
│   │   │   ├── design-panel.tsx
│   │   │   ├── color-picker.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── store.ts            # Zustand state management
│   ├── editor-context.tsx  # Monaco editor context
│   ├── constants.ts        # Tailwind classes & property options
│   ├── html-utils.ts       # HTML parsing & builder ID injection
│   ├── blocks-data.ts      # Drag-and-drop block definitions
│   └── tailwind-utils.ts   # Tailwind class utilities
└── hooks/
    └── use-mobile.ts       # Mobile detection hook
```

---

## 🛠️ Tech Stack

| Technology                                                  | Purpose                         |
| ----------------------------------------------------------- | ------------------------------- |
| [Next.js 16](https://nextjs.org/)                           | React framework with App Router |
| [Tailwind CSS 4](https://tailwindcss.com/)                  | Utility-first CSS framework     |
| [TypeScript](https://www.typescriptlang.org/)               | Type safety                     |
| [Zustand](https://zustand.docs.pmnd.rs/)                    | Lightweight state management    |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editing (VS Code engine)   |
| [Vercel AI SDK](https://ai-sdk.dev/)                        | AI streaming & chat integration |
| [Google Gemini](https://ai.google.dev/)                     | AI model for code generation    |
| [shadcn/ui](https://ui.shadcn.com/)                         | UI component library            |
| [Radix UI](https://www.radix-ui.com/)                       | Accessible primitives           |
| [Lucide](https://lucide.dev/)                               | Icon library                    |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs
- [shadcn/ui](https://ui.shadcn.com/) by shadcn
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) by Microsoft
- [Vercel AI SDK](https://ai-sdk.dev/) by Vercel
- [Google Gemini](https://ai.google.dev/) by Google

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/prabhatpushp">Prabhat Pushp</a></sub>
</div>
