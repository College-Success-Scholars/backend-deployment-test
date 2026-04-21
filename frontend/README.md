# CSS Atlas Frontend

A sophisticated Next.js application featuring a modern sidebar navigation system, authentication, and a beautiful UI built with the latest web technologies.

## 🚀 Features

- **Modern Sidebar Navigation**: Collapsible sidebar with nested navigation items, project switching, and user management
- **Authentication System**: Complete auth flow with Supabase integration (login, signup, password reset)
- **Responsive Design**: Mobile-first design with adaptive sidebar behavior
- **Dark/Light Theme**: Theme switching with system preference detection
- **Modern UI Components**: Built with Radix UI primitives and custom Tailwind CSS styling
- **TypeScript**: Full type safety throughout the application
- **Performance Optimized**: Uses Next.js 15 with Turbopack for fast development and builds

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Authentication**: [Supabase](https://supabase.com/) for auth and database
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- **Package Manager**: [pnpm](https://pnpm.io/) (recommended)

## 📁 Project Structure

```
test-sidebar/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix-based)
│   ├── app-sidebar.tsx   # Main sidebar component
│   └── auth-*.tsx        # Authentication components
├── lib/                  # Utility libraries
│   └── supabase/         # Supabase client configuration
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test-sidebar
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Other Platforms

The application can be deployed to any platform that supports Next.js:

```bash
pnpm build
pnpm start
```

## 🔌 API & Server Architecture (Session Records / Session Logs)

To avoid server/client component clashes, all data access and mutations that the client needs are exposed as **API routes**. The **lib** layer is restricted to **client-safe data-cleaning** (pure functions and types) that can be called from both client and server.

### Summary of changes

- **`lib/`** — Client-safe only: types, constants, and pure data-cleaning (e.g. ticket cleaning, weekly minutes, time helpers). No Supabase or `next/headers` here so client components never pull server-only code.
- **`lib/server/`** — Server-only data layer (`"server-only"`): Supabase fetches, scholar name resolution, and any logic that uses `createClient()` from `lib/supabase/server`. Used by API route handlers and Server Components only.
- **`app/api/`** — All session-records operations the client triggers are HTTP endpoints. Same pattern for every route: auth → parse input → call `lib/server` (and lib for cleaning) → return JSON.

### API route format (consistent for all dev session-records)

Each route:

1. **Auth** — `getDeveloperUser()`; return 403 if not a developer.
2. **Input** — Parse `searchParams` (GET) or `request.json()` (POST); return 400 if invalid.
3. **I/O** — Call `lib/server/session-records` or `lib/server/session-logs` (which use Supabase).
4. **Cleaning** — Use `lib` for pure transformations (e.g. time ranges, ticket cleaning) where needed.
5. **Response** — `NextResponse.json({ data })` or `NextResponse.json({ error }, { status })`.

### Session records API routes

| Method | Path | Purpose |
|--------|------|--------|
| GET | `/api/dev/session-records/front-desk?uid=&week=` | Get one front_desk_record by uid and week |
| GET | `/api/dev/session-records/study?uid=&week=` | Get one study_session_record by uid and week |
| PATCH | `/api/dev/session-records/front-desk/excuse` | Update excuse on a front_desk record (body: `{ uid, weekNum, excuse?, excuse_min? }`) |
| PATCH | `/api/dev/session-records/study/excuse` | Update excuse on a study_session record (body: `{ uid, weekNum, excuse?, excuse_min? }`) |
| POST | `/api/dev/session-records/front-desk/sync` | Sync front_desk_records for a week (body: `{ weekNum, uid? }`) |
| POST | `/api/dev/session-records/front-desk/sync-all` | Sync all UIDs for front_desk (body: `{ weekNum }`) |
| POST | `/api/dev/session-records/study/sync` | Sync study_session_records for a week (body: `{ weekNum, uid? }`) |
| POST | `/api/dev/session-records/study/sync-all` | Sync all UIDs for study (body: `{ weekNum }`) |

### Where things live now

| Concern | Location |
|--------|----------|
| Supabase server client, auth helpers | `lib/supabase/server.ts` (used only in API routes, Server Components, auth) |
| Session log **types** and **pure** ticket cleaning (e.g. `getCleanedAndErroredTickets`) | `lib/session-logs/` (types, session-ticket-utils, utils with pure enrichment) |
| Session log **DB fetch** and name enrichment | `lib/server/session-logs.ts` |
| Session record **types** and **pure** utils (e.g. `getWeekFetchEnd`, `computeWeeklyMinutesByUid`) | `lib/session-records/` (types, utils, weekly-minutes) |
| Session record **DB** (get record, sync) | `lib/server/session-records.ts` |
| Time (campus week, format) | `lib/time/` (pure; used from client and API/server) |

### Pages

- **`/dev/session-records`** — Client component: uses `fetch()` to the API routes above; imports only types and `lib/time` from lib.
- **`/dev/session-logs`** — Server Component: imports data fetchers from `lib/server/session-logs` and types/constants from `lib/session-logs`; no client-side data imports from lib that touch Supabase.

This keeps a clear boundary: **client** → `fetch('/api/...')` and optional **lib** (types + pure helpers); **server** → API handlers and Server Components use **lib/server** + **lib** for cleaning.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
