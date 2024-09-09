import { Server, Socket } from "socket.io";
import { Game } from "./Game";
import { User } from "./User";
import { generateRandomUsername, generateUniqueGameID } from "./lib/util";
export class GameManager {
  private server: Server;
  private randomPlayerWaiting: User;
  private playersWaiting: User[];
  private games: Game[];
  private rooms: string[];
  constructor() {
    this.randomPlayerWaiting = {} as User;
    this.playersWaiting = [];
    this.server = {} as Server;
    this.games = [];
    this.rooms = [];
  }
  handleConnection(server: Server, client: Socket) {
    this.server = server;
    client.on("disconnect", () => {
      if (this.randomPlayerWaiting.id === client.id) {
        this.games = this.games.filter(
          (game) => game.id != this.randomPlayerWaiting.gameId
        );
        this.rooms = this.rooms.filter(
          (room) => room != this.randomPlayerWaiting.gameId
        );
        this.randomPlayerWaiting = {} as User;
      }
      this.playersWaiting = this.playersWaiting.filter(
        (player) => player.id != client.id
      );
      this.games = this.games.filter((game) => {
        const player = this.playersWaiting.find(
          (player) => player.id === client.id
        );
        if (!player) return true;
        game.id !== player.gameId;
      });
      this.rooms = this.rooms.filter((room) => {
        const player = this.playersWaiting.find(
          (player) => player.id === client.id
        );
        if (!player) return true;
        room !== player.gameId;
      });
      console.log("Disconnected");
      console.log(this.rooms);
    });
    client.on("createGame", (data) => this.createGameHandler(data, client));
    client.on("joinGame", (data) => this.joinGameHandler(data, client));
    client.on("joinRandomGame", (data) =>
      this.joinRandomGameHandler(data, client)
    );
  }
  joinRandomGameHandler(data: { username: string }, client: Socket) {
    const username = data.username || "NooBIE";
    if (!this.randomPlayerWaiting.id) {
      const gameId = generateUniqueGameID(this.rooms);
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
    const playerAlreadyWaiting = this.playersWaiting.find(
      (playerWaiting) => playerWaiting.client === client
    );
    if (playerAlreadyWaiting) {
      this.server.to(playerAlreadyWaiting.gameId).emit("gameJoined", {
        username: playerAlreadyWaiting.username,
        id: playerAlreadyWaiting.id,
        gameId: playerAlreadyWaiting.gameId,
        message: "Waiting For Another Player To Join!",
        playersJoined: 1,
      });
      return;
    }
    const username = data.username || "NooBIE";
    const gameId = generateUniqueGameID(this.rooms);
    const player = new User(client, username, gameId, client.id);
    player.client.join(gameId);
    this.server.to(gameId).emit("gameJoined", {
      username,
      id: player.id,
      gameId: gameId,
      message: "Waiting For Another Player To Join!",
      playersJoined: 1,
    });
    this.playersWaiting.push(player);
    this.rooms.push(gameId);
  }

  joinGameHandler(data: { gameId: string; username: string }, client: Socket) {
    const { gameId, username = "NooBIE" } = data;
    if (this.rooms.includes(gameId)) {
      const player = this.playersWaiting.find(
        (player) => player.gameId === gameId
      );
      if (!player) return;
      this.playersWaiting = this.playersWaiting.filter(
        (p) => p.id !== player.id
      );
      const newPlayer = new User(client, username, gameId, client.id);
      newPlayer.client.join(gameId);
      this.server.to(gameId).emit("gameJoined", {
        username,
        id: newPlayer.id,
        gameId,
        message: "Another Player Joined!",
        playersJoined: 2,
      });
      const game = new Game(this.server, gameId, player, newPlayer);
      this.games.push(game);
      game.gameHandler();
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
    console.log("Game Closed", gameId);
    console.log("Games: ", this.games.length, this.games);
    console.log("Rooms: ", this.rooms.length, this.rooms);
    console.log("Players Waiting", this.playersWaiting);
  }
}
