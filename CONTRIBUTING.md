# Contributing to Tailwind Editor

Thank you for your interest in contributing to Tailwind Editor! This guide will help you get started.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Development Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/tailwindeditor.git
   cd tailwindeditor
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your [Google Generative AI API key](https://aistudio.google.com/apikey).

4. **Start the development server**:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the editor.

### Project Architecture

Tailwind Editor is a Next.js 16 application with the following key areas:

- **`app/`** — Next.js App Router pages and API routes
- **`components/editor/`** — Core editor UI (top bar, panels, iframe preview)
- **`components/editor/properties/`** — Property editing panels (design, AI assist, color picker)
- **`components/ui/`** — Reusable shadcn/ui components
- **`lib/`** — State management (Zustand), utilities, and constants
- **`hooks/`** — Custom React hooks

### Key Concepts

- **Builder IDs**: The editor injects `data-builder-id` attributes into the HTML to track elements. These are stripped on export via `removeBuilderIds()`.
- **Iframe Preview**: The visual preview runs in a sandboxed iframe. Communication happens via `postMessage`.
- **Tailwind Classes**: Properties panel manipulates Tailwind utility classes on selected elements. Changes sync bidirectionally between the code editor, iframe, and properties panel.
- **AI Streaming**: The AI assistant streams responses and progressively updates the iframe preview with throttling for performance.

## How to Contribute

### Reporting Bugs

- Use [GitHub Issues](https://github.com/prabhatpushp/tailwindeditor/issues) to report bugs.
- Include steps to reproduce, expected behavior, and actual behavior.
- Include browser/OS information and screenshots if applicable.

### Suggesting Features

- Open a [GitHub Issue](https://github.com/prabhatpushp/tailwindeditor/issues) with the `enhancement` label.
- Describe the use case, proposed solution, and any alternatives you've considered.

### Pull Requests

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines below.

3. **Test your changes**:
   ```bash
   bun run build   # Ensure the project builds
   bun run lint    # Check for lint errors
   ```

4. **Commit** with a clear, descriptive message:
   ```bash
   git commit -m "feat: add support for custom breakpoints"
   ```

5. **Push and open a PR** against `main`.

## Code Style

- **TypeScript** — All code should be properly typed. Avoid `any` where possible.
- **Components** — Use functional components with hooks. Keep components focused and composable.
- **State** — Use Zustand store for global state. Use local `useState` for component-specific state.
- **Styling** — Use Tailwind CSS utility classes. Follow shadcn/ui patterns for new UI components.
- **Naming** — Use PascalCase for components, camelCase for functions/variables, UPPER_SNAKE_CASE for constants.
- **Comments** — Add comments for non-obvious logic. Keep existing comments intact unless they're outdated.

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style (formatting, no logic change) |
| `refactor:` | Code refactoring |
| `perf:` | Performance improvement |
| `test:` | Adding or updating tests |
| `chore:` | Build, tooling, or dependency changes |

## Questions?

Feel free to open an issue or start a discussion if you have questions about contributing.

Thank you for helping make Tailwind Editor better! 🎉
