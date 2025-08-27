## Make ’Em Cry

A tiny Next.js game where you meet quirky characters and try to make them cry with your message. Characters and their images live in `uploads/`. New characters (and images) can be generated via OpenAI + Google Gemini as users browse.

![signup](https://github.com/Suryansh2002/make-em-cry/blob/main/public/screenshot.png?raw=true)

### What’s inside
- Next.js 15 (App Router) + React 19
- Server Actions for data and AI calls
- Image route: `src/app/image/[name]/route.ts` serves files from `uploads/images`
- Data file: `uploads/info.json`

## Prerequisites
- Node.js 18+
- pnpm (recommended)
- API keys (optional but needed for auto-generation):
	- `OPENAI_API_KEY`
	- `GEMINI_API_KEY`
- Optional admin password for deleting: `PASSWORD`

## Setup
1) Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
PASSWORD=your-admin-password
```

2) Install dependencies:

```
pnpm install
```

3) The repo ships with some sample characters/images in `uploads/`. Without API keys you can still browse; new character/image generation requires keys.

## Run
- Dev server:

```
pnpm dev
```

- Production build and start:

```
pnpm build
pnpm start
```

Open http://localhost:3000 and use the arrows to switch characters. Type a message and hit send to see if they cry. Toggling between normal and crying images uses the `/image/[name]` route.

## Code map
- Page: `src/app/page.tsx`
- UI: `src/components/home.tsx`
- Server actions: `src/lib/actions.ts`
- AI + generation: `src/lib/server/ai.ts`
- File I/O helpers: `src/lib/server/file.ts`
- Image route: `src/app/image/[name]/route.ts`

