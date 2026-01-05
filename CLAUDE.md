# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered flashcard desktop application built with GTKX React (GTK4 bindings for React) and TypeScript. Uses Anthropic Claude API for generating contextual flashcards with spaced repetition learning.

## Commands

```bash
npm run dev      # Start development server (gtkx dev src/app.tsx)
npm run build    # Compile TypeScript (tsc -b)
npm run start    # Run compiled application (node dist/index.js)
```

## Architecture

**Stack:** TypeScript + GTKX React + Jotai + TanStack AI (Anthropic)

**Core Modules:**
- `src/app.tsx` - Root component, application shell
- `src/agent.ts` - AI integration layer (Claude sonnet-4-5 for flashcard generation)
- `src/store.ts` - Jotai atoms for global state (cards, navigation, generation)
- `src/storage.ts` - JSON persistence to `~/.local/share/ai-flashcards/flashcards.json`
- `src/types.ts` - TypeScript interfaces (Flashcard, FlashcardStorage)
- `src/components/` - UI components (FlashcardView, TopicInput, ActionButtons, etc.)

**Data Flow:**
1. User enters topic → AI generates flashcards via `agent.ts`
2. Cards stored in Jotai atoms, persisted to filesystem
3. User reviews cards, rates difficulty → Ease factor updated (SM-2 variant)
4. Low-ease cards prioritized for re-learning

**State Management:** Jotai atoms with derived selectors for current card, totals, and actions. Action atoms handle card flipping, navigation, and rating.

## GTKX-Specific Patterns

Use the `/developing-gtkx-apps` skill when working with GTKX widgets. Key patterns:

- Components return GTK widgets (`<box>`, `<label>`, `<button>`, etc.)
- Use `Gtk.Orientation.VERTICAL/HORIZONTAL` for box layouts
- CSS styling via `@gtkx/css` with `cssClass` prop
- Signals use `on_*` naming (e.g., `on_clicked`)
- Application ID: `com.meghdip.aidemo`

## Environment

Requires `ANTHROPIC_API_KEY` in `.env` for AI generation.
