import WebSocket from "ws";

interface Player {
  name: string;
  index: number;
}

interface Room {
  roomId: number;
  roomUsers: Player[];
}

const MAX_PLAYERS_IN_ROOM = 2;
const wsToPlayerMap = new Map<WebSocket, Player>();

const players: Player[] = [];
const rooms: Room[] = [];

const wss = new WebSocket.Server({ port: 8080 });
