import { Server, Socket } from "socket.io";
import { Game } from "./Game";
import { User } from "./User";

export class GameManager {
  private server: Server;
  private randomPlayerWaiting: User;
  private pendingPlayers: User[];
  private games: Game[];
  private rooms: string[];
  constructor() {
    this.randomPlayerWaiting = {} as User;
    this.server = {} as Server;
    this.pendingPlayers = [];
    this.games = [];
    this.rooms = [];
  }
  generateGameId() {
    return Math.random().toString(36).substring(5, 11).toUpperCase();
  }
  generateUniqueGameID() {
    let gameId;
    do {
      gameId = this.generateGameId();
    } while (this.rooms.includes(gameId));
    return gameId;
  }

  handleConnection(server: Server, client: Socket) {
    this.server = server;
    client.on("disconnect", () => console.log(`${client.id} Disconnected\n`));
    client.on("createGame", (data) => this.createGameHandler(data, client));
    client.on("joinGame", (data) => this.joinGameHandler(data, client));
    client.on("joinRandomGame", (data) =>
      this.joinRandomGameHandler(data, client)
    );
  }

  joinRandomGameHandler(data: { username: string }, client: Socket) {
    const username = data.username || "NooBIE";
    if (!this.randomPlayerWaiting.id) {
      const gameId = this.generateUniqueGameID();
      this.randomPlayerWaiting = new User(client, username, gameId, client.id);
      this.randomPlayerWaiting.client.join(gameId);
      this.server.to(gameId).emit("gameJoined", {
        username: this.randomPlayerWaiting.username,
        id: this.randomPlayerWaiting.id,
        gameId: gameId,
        message: "Waiting For Another Player To Join!",
        playersJoined: 1,
      });
      this.rooms.push(gameId);
      return;
    }
    const gameId = this.randomPlayerWaiting.gameId;
    if (
      this.rooms.includes(gameId) &&
      this.randomPlayerWaiting.id != client.id
    ) {
      const player = new User(client, username, gameId, client.id);
      player.client.join(gameId);
      this.server.to(gameId).emit("gameJoined", {
        username,
        id: player.id,
        gameId,
        message: "Another Player Joined!",
        playersJoined: 2,
      });
      const game = new Game(
        this.server,
        gameId,
        this.randomPlayerWaiting,
        player
      );
      this.games.push(game);
      this.randomPlayerWaiting = {} as User;
      game.gameHandler();
    } else {
      client.emit("error", {
        message: "Game ID not Found",
        errorCode: "404",
      });
    }
  }
  createGameHandler(data: { username: string }, client: Socket) {
    let pendingPlayer = this.pendingPlayers.find(
      (player) => player.id === client.id
    );
    if (pendingPlayer) {
      this.server.to(pendingPlayer.gameId).emit("gameJoined", {
        username: pendingPlayer.username,
        id: pendingPlayer.id,
        gameId: pendingPlayer.gameId,
        message: "Waiting For Another Player To Join!",
        playersJoined: 1,
      });
      return;
    }
    const username = data.username || "NooBIE";
    const gameId = this.generateUniqueGameID();
    pendingPlayer = new User(client, username, gameId, client.id);
    pendingPlayer.client.join(gameId);
    this.server.to(gameId).emit("gameJoined", {
      username,
      id: pendingPlayer.id,
      gameId: gameId,
      message: "Waiting For Another Player To Join!",
      playersJoined: 1,
    });
    this.pendingPlayers.push(pendingPlayer);
    this.rooms.push(gameId);
  }

  joinGameHandler(data: { gameId: string; username: string }, client: Socket) {
    const { gameId, username = "NooBIE" } = data;
    if (this.rooms.includes(gameId)) {
      const player = new User(client, username, gameId, client.id);
      player.client.join(gameId);
      this.server.to(gameId).emit("gameJoined", {
        username,
        id: player.id,
        gameId,
        message: "Another Player Joined!",
        playersJoined: 2,
      });
      const pendingPlayer = this.pendingPlayers.find(
        (player) => player.gameId === gameId
      );
      if (!pendingPlayer) {
        client.emit("error", {
          message: "Player not Found",
          errorCode: "404",
        });
        return;
      }
      const game = new Game(this.server, gameId, pendingPlayer, player);
      this.games.push(game);
      game.gameHandler();
      this.pendingPlayers = this.pendingPlayers.filter(
        (player) => player.gameId !== gameId
      );
    } else {
      client.emit("error", {
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
    this.pendingPlayers = this.pendingPlayers.filter(
      (player) => player.gameId !== gameId
    );
    console.log("Game Closed", gameId);
    console.log("Games: ", this.games.length, this.games);
    console.log("Rooms: ", this.rooms.length, this.rooms);
    console.log(
      "Pending Player: ",
      this.pendingPlayers.length,
      this.pendingPlayers.map((player) => player.username)
    );
  }
}
