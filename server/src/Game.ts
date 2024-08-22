import { Server } from "socket.io";
import { User } from "./User";
import { removeGame } from ".";

export class Game {
  io: Server;
  id: string;
  private turn: User;
  private player1: User;
  private player2: User;
  private board: string[];
  private queueX: number[];
  private queueO: number[];

  constructor(io: Server, id: string, player1: User, player2: User) {
    (this.io = io), (this.turn = player1);
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
    this.board = [];
    this.queueO = [];
    this.queueX = [];
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
    this.player1.socket.leave(this.id);
    this.player2.socket.leave(this.id);
    // this.player1.socket.disconnect();
    // this.player2.socket.disconnect();
    this.turn = {} as User;
    this.id = "";
    this.player1 = {} as User;
    this.player2 = {} as User;
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
    console.log(
      "Game initialized",
      this.id,
      "Turn:",
      this.turn.username,
      "Random: ",
      random
    );
    this.player1.socket.emit("init", {
      username: this.player1.username,
      sign: this.player1.sign,
      id: this.player1.socket.id,
    });
    this.player2.socket.emit("init", {
      username: this.player2.username,
      sign: this.player2.sign,
      id: this.player2.socket.id,
    });
  }
  gameHandler() {
    this.player1.socket.on("move", (data, callback) => {
      if (this.moveHandler(data, this.player1)) {
        try {
          callback({ message: "Move Successful", status: 200 });
        } catch (e) {
          console.error(e);
        }
      }
    });
    this.player2.socket.on("move", (data, callback) => {
      if (this.moveHandler(data, this.player2)) {
        try {
          callback({ message: "Move Successful", status: 200 });
        } catch (e) {
          console.error(e);
        }
      }
    });
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
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        console.log("Winner is", this.turn.username + " " + this.turn.sign);
        try {
          this.io.to(this.id).emit("win", {
            winner: this.turn.username,
            id: this.turn.socket.id,
            message: `Winner is ${this.turn.username} ${this.turn.sign}`,
          });
          this.destroyGame();
          return;
        } catch (e) {
          console.error(e);
        }
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
        this.io
          .to(player.socket.id)
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
      this.io
        .to(player.socket.id)
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
        this.io.to(this.id).emit("remove", { move: removed.toString() });
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
        this.io.to(this.id).emit("remove", { move: removed.toString() });
      }
      this.board[move] = "O";
      this.queueO.push(move);
    } else {
      return;
    }
    this.checkWin();
  }
  moveHandler(data: { move: string }, player: User) {
    if (this.isTurn(player)) {
      if (this.isValid(player, data.move)) {
        console.log(player.sign, "Marked", data.move);
        try {
          player.socket.to(this.id).emit("move", {
            move: data.move,
            id: player.socket.id,
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
