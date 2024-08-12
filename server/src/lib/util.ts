import { Socket } from "socket.io";

export function createRoomId(id1: string, id2: string) {
  const length = 6;
  const rand = (Math.random() * 10) % 6;
  const roomId = id1.substring(0, rand) + id2.substring(0, length - rand);
  return roomId;
}
