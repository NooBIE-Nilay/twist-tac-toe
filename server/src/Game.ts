import { Server } from "socket.io";
import { User } from "./User";
import { removeGame } from ".";

export class Game {
  server: Server;
  id: string;
  private turn: User;
  private player1: User;
  private player2: User;
  private board: string[];
  private queueX: number[];
  private queueO: number[];

  constructor(server: Server, id: string, player1: User, player2: User) {
    this.server = server;
    this.turn = player1;
    this.id = id;
    this.board = [];
    this.queueO = [];
    this.queueX = [];
    this.player1 = player1;
    this.player2 = player2;
    if (player1 === undefined || player2 === undefined) {
      console.log("Cannot Create Game, User Invalid!");
      console.log("Player1:", player1, "Player2:", player2);
      return;
    }
    console.log(
      "Game created",
      this.id,
      "Player1:",
      this.player1.username,
      "Player2:",
      this.player2.username
    );
    this.initGame();
  }
  destroyGame() {
    console.log("Game destroyed", this.id);
    removeGame(this.id);
    this.player1.client.leave(this.id);
    this.player2.client.leave(this.id);
    this.turn = {} as User;
    this.id = "";
    this.board = [];
    this.queueO = [];
    this.queueX = [];
  }
  initGame() {
    const random = Math.random();
    if (random > 0.5) {
      this.turn = this.player1;
      this.player1.sign = "X";
      this.player2.sign = "O";
    } else {
      this.turn = this.player2;
      this.player2.sign = "X";
      this.player1.sign = "O";
    }
    try {
      this.player1.client.emit("init", {
        username: this.player1.username,
        sign: this.player1.sign,
        turn: this.player1.sign === "X" ? true : false,
        id: this.player1.client.id,
      });
      this.player2.client.emit("init", {
        username: this.player2.username,
        sign: this.player2.sign,
        turn: this.player2.sign === "X" ? true : false,
        id: this.player2.client.id,
      });
    } catch (e) {
      console.error(e);
    }
  }
  gameHandler() {
    try {
      this.player1.client.on("move", (data, callback) => {
        if (this.moveHandler(data, this.player1)) {
          try {
            callback({ message: "Move Successful", status: 200 });
          } catch (e) {
            console.error(e);
          }
        }
      });
      this.player2.client.on("move", (data, callback) => {
        if (this.moveHandler(data, this.player2)) {
          try {
            callback({ message: "Move Successful", status: 200 });
          } catch (e) {
            console.error(e);
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  checkWin() {
    console.log(this.board);
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] !== undefined &&
        this.board[a] !== "" &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        console.log("Winner is", this.turn.username + " " + this.turn.sign);
        try {
          this.server.to(this.id).emit("win", {
            winner: this.turn.username,
            id: this.turn.client.id,
            message: `Winner is ${this.turn.username} ${this.turn.sign}`,
          });
          this.destroyGame();
          return;
        } catch (e) {
          console.error(e);
        }
        break;
      }
    }
  }

  isValid(player: User, move: string) {
    console.log("isV Move", move);
    if (
      !move ||
      move.length !== 1 ||
      Number(move) < 0 ||
      Number(move) > 8 ||
      !(
        this.board[Number(move)] === undefined ||
        this.board[Number(move)] === ""
      )
    ) {
      try {
        this.server
          .to(player.client.id)
          .emit("error", { message: "Move Not Valid", errorCode: 304 });
        return false;
      } catch (e) {
        console.error(e);
      }
    }
    console.log("Valid Move");
    return true;
  }
  isTurn(player: User) {
    if (player === this.turn) return true;
    try {
      this.server
        .to(player.client.id)
        .emit("error", { message: "Not Your Turn", errorCode: 303 });
      return false;
    } catch (e) {
      console.error(e);
    }
  }

  initMove(data: { move: string }, player: User) {
    const move = Number(data.move);
    if (player.sign === "X") {
      if (this.queueX.length === 3) {
        console.log("Before", this.queueX);
        const removed = this.queueX.shift() || 0;
        console.log("After", this.queueX);
        this.board[removed] = "";
        console.log(player.sign, removed);
        try {
          this.server.to(this.id).emit("remove", { move: removed.toString() });
        } catch (e) {
          console.error(e);
        }
      }
      this.board[move] = "X";
      this.queueX.push(move);
    } else if (player.sign === "O") {
      if (this.queueO.length === 3) {
        console.log("Before: ", this.queueO);
        const removed = this.queueO.shift() || 0;
        console.log("After: ", this.queueO);
        this.board[removed] = "";
        console.log(player.sign, removed);
        try {
          this.server.to(this.id).emit("remove", { move: removed.toString() });
        } catch (e) {
          console.error(e);
        }
      }
      this.board[move] = "O";
      this.queueO.push(move);
    } else {
      return;
    }
    this.checkWin();
  }
  moveHandler(data: { move: string }, player: User) {
    if (!player) return;
    if (this.isTurn(player)) {
      if (this.isValid(player, data.move)) {
        console.log(player.sign, "Marked", data.move);
        try {
          player.client.to(this.id).emit("move", {
            move: data.move,
            id: player.client.id,
            username: player.username,
          });
        } catch (e) {
          console.error(e);
        }
        this.initMove(data, player);
        this.turn = player === this.player1 ? this.player2 : this.player1;
        return true;
      }
    }
    return false;
  }
}
