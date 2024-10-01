function generateId(): string {
  return Math.random().toString(36);
}
export class Move {
  id: string;
  gameId: string;
  playerId: string;
  movePosition: string;
  isActive: boolean;
  removedByMoveId: string;
  createdAt: Date;

  constructor() {
    this.id = "";
    this.gameId = "";
    this.playerId = "";
    this.movePosition = "";
    this.isActive = true;
    this.removedByMoveId = "";
    this.createdAt = new Date();
  }
  generateMove(gameId: string, playerId: string, movePosition: string): string {
    this.id = generateId();
    this.gameId = gameId;
    this.playerId = playerId;
    this.movePosition = movePosition;
    this.isActive = true;
    this.removedByMoveId = "";
    this.createdAt = new Date();
    return this.id;
  }

  removeMove(userId: string, moveId: string, removedByMoveId: string) {
    if (this.playerId === userId && this.id === moveId) {
      this.isActive = false;
      this.removedByMoveId = removedByMoveId;
    }
  }
}
