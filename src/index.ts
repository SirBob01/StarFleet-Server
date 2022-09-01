import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from './Server';

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Run the server
const port = 3200;
httpServer.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Listening on port ${port}`);
});

// Run game logic
const server = new Server(httpServer);

// Update the world at 60 FPS, broadcast game state at 15 fps
let lastUpdate = Date.now();
setInterval(() => {
  const now = Date.now();
  const dt = now - lastUpdate;
  lastUpdate = now;

  server.update(dt);
}, 1000.0 / 60.0);
setInterval(() => server.broadcast(), 1000.0 / 15.0);
