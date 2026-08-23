# SYNC://KRISHNA

Sync With Krishna is a Matrix-inspired interactive personal terminal built with Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, and a Markdown knowledge base.

The Phase 1 experience is deterministic and local:

1. Static Markdown files provide the facts.
2. A typed intent engine maps commands and natural-language questions.
3. React renders terminal history and specialized result records.
4. Unknown questions return suggestions instead of fabricated answers.

There is no AI SDK, external API, database, authentication, or backend question endpoint.

## Commands

```bash
npm run dev
npm run intent:check
npm run typecheck
npm run lint
npm run build
```

Set `SITE_URL=https://www.syncwithkrishna.com` in production for canonical metadata, the sitemap, and robots output.

## Content

Edit Krishna's information in `src/content/*.md`. Frontmatter powers structured terminal records; Markdown bodies provide supporting prose. Missing facts are marked TODO.

## Architecture

```text
src/app/                       App Router shell, metadata, sitemap, robots
src/components/terminal/       Terminal interaction and Matrix canvas
src/content/                   Markdown knowledge records
src/lib/intent-engine.ts       Pure local intent resolution
src/lib/knowledge.ts           Server-only typed Markdown loader
src/lib/terminal-types.ts      Shared domain types
scripts/check-intents.mjs      Representative intent verification
```

Phase 2 can add an AI fallback after `resolveIntent()` returns `unknown` or a confidence below a chosen threshold. It should not replace the verified local knowledge path.
