import { Server, Socket } from "socket.io";
import { Game } from "./Game";
import { User } from "./User";

export class GameManager {
  private io: Server;
  private pendingPlayer: User;
  private gameId: string;
  private games: Game[];
  private rooms: string[];
  constructor() {
    this.io = {} as Server;
    this.pendingPlayer = {} as User;
    this.gameId = "";
    this.games = [];
    this.rooms = [];
  }
  handleConnection(
    io: Server,
    socket: Socket // io: Socket.io Server, socket: Socket.io New client Socket
  ) {
    this.io = io;
    socket.on("disconnect", () => console.log(`${socket.id} Disconnected\n`));
    socket.on("createGame", (data) => this.createGame(data, socket));
    socket.on("joinGame", (data) => this.joinGame(data, socket));
  }

  createGame(data: { username: string }, socket: Socket) {
    const username = data.username || "NooBIE";
    this.gameId = Math.random().toString(36).substring(5, 11).toUpperCase();
    this.pendingPlayer = new User(socket, username, this.gameId, socket.id);
    this.pendingPlayer.socket.join(this.gameId);
    this.io.to(this.gameId).emit("gameJoined", {
      username,
      id: this.pendingPlayer.id,
      gameId: this.gameId,
    });
    this.rooms.push(this.gameId);
  }

  joinGame(data: { gameId: string; username: string }, socket: Socket) {
    const { gameId, username = "NooBIE" } = data;

    if (this.rooms.includes(gameId)) {
      const player = new User(socket, username, gameId, socket.id);
      player.socket.join(gameId);
      this.io
        .to(this.gameId)
        .emit("gameJoined", { username, id: player.id, gameId: this.gameId });
      const game = new Game(this.io, gameId, this.pendingPlayer, player);
      this.games.push(game);
      game.gameHandler();
    } else {
      socket.emit("error", {
        message: "Game ID not Found",
        errorCode: "404",
      });
    }
  }
  closeGame(data: { gameId: string }) {
    const { gameId } = data;
    if (this.rooms.includes(gameId)) {
      this.rooms = this.rooms.filter((room) => room !== gameId);
    }
    this.games = this.games.filter((game) => game.id !== gameId);
  }
}
