export interface Room {
  id: number;
  players: Player[]
}

export interface Player {
}

export interface GameStatus {
}

export let rooms: Room[] = [];
export let players: Player[] = [];
export let gameStatus: GameStatus = {};

export function addRoom(room: Room): void {
  rooms.push(room);
}

export function removeRoom(roomId: number): void {
  rooms = rooms.filter((room) => room.id !== roomId);
}

export function addPlayer(player: Player): void {
  players.push(player);
}
