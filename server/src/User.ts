import { Socket } from "socket.io";

export class User {
  socket: Socket;
  username: string;
  private id: string;
  gameId: string;
  sign: string;
  constructor(socket: Socket, username: string, gameId: string, id: string) {
    this.socket = socket;
    this.username = username;
    this.id = id;
    this.gameId = gameId;
    console.log("User created", this.username, "ID:", id);
    this.sign = "";
  }
}
