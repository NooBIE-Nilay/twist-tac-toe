require("dotenv").config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { GameManager } from "./GameManager";

const PORT = Number(process.env.PORT) || 3000;
const BACKEND_URL = process.env.URL || "http://localhost";

const gameManager = new GameManager();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 5 * 60 * 1000,
    skipMiddlewares: true,
  },
  cors: {
    origin: "http://localhost:5173",
  },
});

export function removeGame(gameId: string) {
  gameManager.closeGame({ gameId });
}
app.get("/", (req, res) => {
  res.json({ msg: "Hello From Server" });
});
io.on("connection", (socket) => {
  console.log(socket.id, " Connected\n");
  gameManager.handleConnection(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server Running on  ${BACKEND_URL}:${PORT}`);
});
