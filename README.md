# kidalica
Riff catalog app, fully vibe coded.
## kidalica.app

A minimal, beautifully designed song library for guitar practice. Songs are Markdown files in `content/songs`, rendered as a static site (no backend). Built with Next.js App Router, Tailwind CSS, and shadcn-style components.

### Develop

```bash
pnpm i # or npm i / yarn
pnpm dev
```

Then open `http://localhost:3000`.

### Add songs

Place `.md` or `.mdx` files in `content/songs` with frontmatter:

```md
---
title: Song Title
artist: Artist Name
difficulty: easy | medium | hard
tags: [tag1, tag2]
playlist: [warmup, practice]
---

Your chord sheet or lyrics here.
```

### Deploy (Vercel)

- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`

### Tech

- Next.js 14 (App Router)
- Tailwind CSS
- shadcn-inspired UI primitives
- MagicUI-inspired gradient shimmer
