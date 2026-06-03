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

- **Provider pattern** — `IHotelProvider` interface lets you add new providers (e.g. a second API) by implementing one class and registering it in `searchService`.
- **Parallel fan-out** — for a group size of N the server fires concurrent requests for N, N+1, and N+2 (capped at 10). Each resolved batch is pushed to the client immediately via WebSocket.
- **Streaming sort** — the client inserts each arriving hotel in sorted-by-price order so the list is always correct even mid-load.
