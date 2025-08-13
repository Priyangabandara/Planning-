import express from 'express';
import http from 'http';
import cors from 'cors';
import routes from './api/routes.js';
import { config } from './config.js';
import { setupWebsocket } from './ws/gateway.js';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use('/api', routes);

const server = http.createServer(app);
setupWebsocket(server);

server.listen(config.port, () => {
  console.log(`Backend listening on :${config.port}`);
});