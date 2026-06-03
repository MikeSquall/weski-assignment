import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { wsSearchMessageSchema } from './schemas/search';
import { SearchService } from './services/searchService';
import { PowderWhiteProvider } from './providers/powderwhite/PowderWhiteProvider';
import { WsServerMessage } from './types';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

const searchService = new SearchService([new PowderWhiteProvider()]);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

function send(ws: WebSocket, message: WsServerMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    try {
      const raw = JSON.parse(data.toString());
      const message = wsSearchMessageSchema.parse(raw);

      await searchService.search(message.payload, (hotel) => {
        send(ws, { type: 'hotel', payload: hotel });
      });

      send(ws, { type: 'done' });
    } catch (err) {
      console.error('[WS] Error handling message:', err);
      send(ws, { type: 'error', payload: 'Search failed. Please try again.' });
    }
  });
});

const PORT = process.env.PORT ?? 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
