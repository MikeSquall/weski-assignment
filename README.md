# WeSki – Ski Hotel Search

A full-stack hotel search app for ski resorts. Results stream in real-time via WebSocket, sorted by price ascending as they arrive.

## Prerequisites

- Node.js 18+
- npm 8+

## Setup & Running

```bash
# Install all dependencies (root + client + server)
npm install

# Start both server and client in development mode
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Building for Production

```bash
npm run build

# Start the production API server
npm start
```

Then serve `client/dist/` with any static file server (nginx, `serve`, etc.) alongside the Node.js backend.

## Testing

```bash
# Run all tests (server + client)
npm test

# Run only server tests
npm run test --workspace=weski-server

# Run only client tests
npm run test --workspace=weski-client

# Watch mode (either workspace)
npm run test:watch --workspace=weski-server
npm run test:watch --workspace=weski-client
```

**Server** (Vitest, Node environment) — 18 tests across 3 suites:

| Suite | What's covered |
|---|---|
| `schemas.test.ts` | Zod message validation — valid inputs, boundary violations, wrong types |
| `powderwhite.provider.test.ts` | API request shaping, response mapping, `MainImage` selection, fallback to first image, non-OK error path |
| `searchService.test.ts` | N/N+1/N+2 fan-out, cap at 10, partial failure recovery, multi-provider dispatch |

**Client** (Vitest + jsdom + React Testing Library) — 45 tests across 5 suites:

| Suite | What's covered |
|---|---|
| `searchStore.test.ts` | Initial state, `addHotel` sort invariant, `clearResults`, `setLoading` |
| `HotelCard.test.tsx` | All rendered fields, loading skeleton, no-image placeholder |
| `ResultsList.test.tsx` | Pre-search blank, spinner lifecycle, empty state, result count, subtitle metadata |
| `SearchBar.test.tsx` | Resort list rendered, store updates on field changes, loading button state |
| `useHotelSearch.test.ts` | WebSocket lifecycle, date format conversion, hotel streaming, done/error handling, guard on missing fields |

## Architecture

```
weski-assignment/
├── server/                        Node.js / Express / WebSocket
│   └── src/
│       ├── providers/
│       │   ├── IHotelProvider.ts  Generic provider interface
│       │   └── powderwhite/       Concrete PowderWhite connector
│       ├── services/
│       │   └── searchService.ts   Parallel fan-out across group sizes
│       └── index.ts               HTTP + WebSocket server (port 3001)
└── client/                        React / Vite / Tailwind
    └── src/
        ├── store/searchStore.ts   Zustand state (search params + results)
        ├── hooks/useHotelSearch.ts WebSocket client, streams hotels
        └── components/            SearchBar, HotelCard, ResultsList
```

### Key design decisions

- **Provider pattern** — `IHotelProvider` interface lets you add new providers (e.g. a second API) by implementing one class and registering it in `searchService`. Each provider owns its own response schema (`providers/<name>/schemas.ts`) so validation is scoped to the API it talks to; the shared `schemas/search.ts` only holds the WebSocket message contract.
- **Parallel fan-out** — for a group size of N the server fires concurrent requests for N, N+1, and N+2 (capped at 10). Each resolved batch is pushed to the client immediately via WebSocket.
- **Streaming sort** — the client inserts each arriving hotel in sorted-by-price order so the list is always correct even mid-load.
