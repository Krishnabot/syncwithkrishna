# Sync With Krishna

`syncwithkrishna` is a personal publishing website built with Next.js. It contains journals, essays, poems, tags, pagination, an authenticated administration area, RSS and sitemap endpoints, and a dedicated TikTok-to-YouTube instruction route.

Primary production URL: `https://www.syncwithkrishna.com`

## Technology

- Next.js 16 App Router
- React 19
- TypeScript with strict checking
- Tailwind CSS 4
- Lucide React icons
- Markdown/MDX rendering with `next-mdx-remote`, `gray-matter`, Remark, and Rehype
- `sql.js` with a local SQLite file for application data
- ESLint with the Next.js Core Web Vitals and TypeScript presets

## Requirements

- Node.js compatible with Next.js 16
- npm
- Network access during a clean production build so `next/font` can download Geist and Geist Mono from Google Fonts

## Installation

```bash
npm ci
```

For normal dependency development, `npm install` can also be used.

## Environment variables

Create `.env.local` when these settings are needed:

```dotenv
SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
```

### `SITE_URL`

This is the canonical public origin. In production it should normally be:

```dotenv
SITE_URL=https://www.syncwithkrishna.com
```

It is used by root metadata, canonical URLs, Open Graph URLs, post structured data, `/sitemap.xml`, `/robots.txt`, and `/rss.xml`. When omitted, the application falls back to `http://localhost:3000`. Always set it in production so generated links do not point to localhost.

### `ADMIN_EMAIL` and `ADMIN_PASSWORD`

These values protect the administration login. If either is missing, the login endpoint reports that administrator credentials are not configured. Do not commit real credentials or `.env.local`.

## Development

Start the development server:

```bash
npm run dev
```

Then open:

- Main website: `http://localhost:3000`
- YouTube guide: `http://localhost:3000/youtuberedirection`
- Explicit guide preview: `http://localhost:3000/youtuberedirection?preview=1`

Localhost always displays the instruction guide and never automatically redirects to YouTube.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

- `dev` starts the Next.js development server.
- `lint` checks the project with ESLint.
- `build` creates an optimized production build.
- `start` runs a previously built production application.

There is no separate `typecheck` script. Run:

```bash
npx tsc --noEmit
```

If Windows PowerShell blocks `npx.ps1`, use:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

## Project structure

```text
content/
  posts/                    Markdown source posts
data/
  blog.sqlite               Local SQL.js database
public/                     Static assets
seeds/                      Seed content and documentation
src/
  app/                      Next.js App Router routes and API handlers
    admin/                  Administration pages
    api/                    Posts and administration APIs
    posts/                  Post indexes, categories, pagination, and details
    tags/                   Tag indexes and pagination
    youtuberedirection/     TikTok-to-YouTube instruction route
    layout.tsx              Shared root layout and metadata
    globals.css             Tailwind, theme variables, and shared styles
  components/               Shared React components
    admin/                  Administration components
    mdx/                    Custom MDX components
    YouTubeRedirectGuide.tsx
  lib/                      Content, database, authentication, API, and detection helpers
```

The `@/*` TypeScript alias imports files from `src/*`.

## Routes

### Public pages

- `/` — home
- `/posts` — all published posts
- `/posts/page/[page]` — paginated archive
- `/posts/journal` and `/posts/journal/page/[page]`
- `/posts/essay` and `/posts/essay/page/[page]`
- `/posts/poem` and `/posts/poem/page/[page]`
- `/posts/[category]/[slug]` — individual post
- `/tags` — tag index
- `/tags/[tag]` and `/tags/[tag]/page/[page]`
- `/youtuberedirection` — TikTok instructions and YouTube redirect

### Development-only page

- `/drafts` — returns not found outside development

### Administration pages

- `/admin/login`
- `/admin`
- `/admin/new`
- `/admin/edit/[slug]`

### Generated endpoints

- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`

### API endpoints

- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/[slug]`
- `PUT /api/posts/[slug]`
- `DELETE /api/posts/[slug]`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `POST /api/admin/seed`

Mutation endpoints use the administration session checks implemented in the API helpers and route handlers.

## Content and database

Markdown source files live in:

```text
content/posts/journals/
content/posts/essays/
content/posts/poems/
```

Expected frontmatter:

```md
---
title: "My First Journal"
date: "2026-01-07"
tags: ["daily", "testing"]
excerpt: "A short summary"
draft: false
---

Post content goes here.
```

Supported categories are `journal`, `essay`, and `poem`; filesystem directories use the plural names.

Administration features store posts and sessions in `data/blog.sqlite` through `sql.js`. Server-rendered listing helpers prefer database content when the database contains posts. Individual post rendering can fall back to Markdown when a matching database post does not exist.

The database is written to the local filesystem. Confirm that the deployment provides persistent writable storage before relying on administration changes in production. Ephemeral or read-only serverless filesystems may lose changes or reject writes. Durable multi-instance hosting would normally require a managed database.

## Authentication

Successful administrator login creates a random session token, stores it in SQLite, and sends an HTTP-only, same-site `lax` cookie named `session` with a root path.

The cookie has no shared `Domain` attribute, so it is host-scoped. Logging in on one domain does not log the administrator in on another domain.

## Styling

Tailwind CSS is loaded through `@tailwindcss/postcss` and imported by `src/app/globals.css`. The project defines a purple/violet theme, light and dark variables, typography, buttons, cards, content styles, and shared animations.

The root layout loads Geist and Geist Mono using `next/font`. Restricted network environments may show fallback-font warnings or block a clean production build when Google Fonts cannot be reached.

## YouTube redirection route

Route and production URL:

```text
/youtuberedirection
https://www.syncwithkrishna.com/youtuberedirection
```

Destination:

```text
https://www.youtube.com/@thenepalibookworm
```

### Behavior precedence

1. `?preview=1` always displays the guide.
2. `localhost`, `127.0.0.1`, and `::1` always display the guide.
3. A recognized in-app browser displays the guide.
4. A normal browser redirects to YouTube.

Normal browsers briefly show “Opening YouTube…” and call `window.location.replace()` after about 350 milliseconds. The HTTPS destination lets the operating system open the YouTube app when supported and otherwise uses the website.

### In-app browser detection

Detection is case-insensitive and currently recognizes:

- TikTok
- `musical_ly` and separator variants
- ByteDance
- TikTok variants such as `TTWebView`, Trill, Aweme, and ZhiliaoApp
- Generic Android WebView markers used when an app hides its product name
- Generic iPhone and iPad WebViews that omit standalone-browser identifiers
- Instagram
- Facebook, including `FBAV` and `FBAN`

Normal Safari, Chrome, Firefox, Edge, Opera, and DuckDuckGo identifiers on iOS are excluded from the generic iOS WebView fallback so they can proceed to the YouTube redirect.

Known TikTok, Instagram, and Facebook referrer hostnames are also treated as an in-app entry signal when available.

User-agent detection is heuristic and cannot guarantee identification of every current or future in-app browser.

### Instruction guide details

- Nepali-first and English-second Step 1 and Step 2 instructions
- Responsive canvas arrow aimed toward TikTok’s estimated native top-right menu position
- Vector hand demonstrating the two taps
- Simulated sheet containing exactly `Report`, `Open in browser`, and `Copy link`
- Lucide flag, compass, and link icons
- Responsive Retina/high-density canvas rendering
- Resize and orientation handling
- Animation-frame, listener, and timer cleanup
- Static reduced-motion presentation for `prefers-reduced-motion: reduce`
- Semantic HTML instructions and screen-reader announcements

The simulated sheet uses `pointer-events: none`. It is purely instructional and cannot invoke TikTok’s native “Open in browser” command.

### Previewing

Local:

```text
http://localhost:3000/youtuberedirection
```

Production without redirecting:

```text
https://www.syncwithkrishna.com/youtuberedirection?preview=1
```

Opening the production route without `?preview=1` in a normal Chrome, Safari, Firefox, Edge, or Samsung Internet browser redirects to YouTube.

## Multi-domain behavior

The current application is host-agnostic. It has no hostname middleware, domain routing table, tenant system, domain-specific layout, or `Host` header branching.

Every domain connected to the same deployment therefore receives the same application and routes. Once configured with the host and DNS, examples include:

```text
https://www.syncwithkrishna.com/youtuberedirection
https://syncwithkrishna.com/youtuberedirection
https://another-connected-domain.example/youtuberedirection
```

The guide decision depends on query parameters, localhost, and user agent—not on the production domain.

### SEO limitation

Only one `SITE_URL` value is supported. All connected domains can display the application, but canonical metadata, sitemap entries, RSS links, robots sitemap references, and structured data use that single origin.

This is appropriate when secondary domains are aliases and one domain is canonical. Independent domain branding, metadata, content, or routes would require a separately designed hostname-aware implementation.

### Adding alias domains

No code changes are required just to serve the same website from another domain. Operational setup still requires:

1. Add the custom domain to the hosting project.
2. Configure its DNS records.
3. Verify TLS/HTTPS provisioning.
4. Keep one canonical domain in `SITE_URL`.
5. Optionally redirect aliases to the canonical domain at the hosting layer.

DNS and hosting-provider domain settings are not stored in this repository, so currently connected domains cannot be determined from source code alone.

## Deployment checklist

1. Set `SITE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
2. Run `npm ci`.
3. Run `npm run lint`.
4. Run `npx tsc --noEmit`.
5. Run `npm run build`.
6. Confirm persistent storage if production administration will write to SQLite.
7. Connect the domain and verify HTTPS.

For a standard Node deployment:

```bash
npm run build
npm run start
```

## Important files

- `src/app/layout.tsx` — root layout and global metadata
- `src/app/globals.css` — Tailwind and theme styles
- `src/lib/content.ts` — filesystem and database content access
- `src/lib/sqlite.ts` — SQL.js operations
- `src/lib/auth.ts` — administrator sessions
- `src/app/youtuberedirection/page.tsx` — route entry and metadata
- `src/components/YouTubeRedirectGuide.tsx` — redirect logic, bilingual guide, canvas, and simulated menu
- `src/lib/inAppBrowser.ts` — preview, localhost, and in-app detection
- `src/app/sitemap.ts` — sitemap generation
- `src/app/robots.txt/route.ts` — robots response
- `src/app/rss.xml/route.ts` — RSS generation

## Current cautions

- Domain-specific behavior is not implemented.
- `SITE_URL` supports one canonical origin.
- Administrator sessions are host-scoped across domains.
- User-agent detection is heuristic.
- SQL.js needs durable writable storage for reliable production administration.
- Geist downloads can fail in restricted-network build environments.
