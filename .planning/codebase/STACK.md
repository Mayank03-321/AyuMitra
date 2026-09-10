# Tech Stack Documentation

## Core Technologies
* **Frontend Framework**: React 19 (`react`, `react-dom`) with TypeScript 5.8
* **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`), Lucide React icons (`lucide-react`), Motion animation library (`motion`)
* **Build System**: Vite 6 (`vite`, `@vitejs/plugin-react`, `esbuild`)
* **Backend Runtime**: Node.js with Express 4 (`express`, `tsx`)
* **Database & ORM**: PostgreSQL with Prisma ORM 7 (`@prisma/client`, `prisma`, `@prisma/adapter-pg`, `pg`)
* **AI & LLM Integration**: Google Gemini API (`@google/genai`)

## Key Scripts
* `npm run dev`: Starts the unified Express + Vite dev server via `tsx server.ts`
* `npm run build`: Bundles frontend with Vite and server with esbuild
* `npm run start`: Runs the built server from `dist/server.cjs`
* `npm run lint`: Type-checks with `tsc --noEmit`
