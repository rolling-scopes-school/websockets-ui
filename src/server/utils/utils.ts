import { RawData } from 'ws';
import { WSMessage } from '../models/types/Message';
import {
  ServerAttackData,
  ServerUpdateRoomDataItem,
  ServerUpdateWinnersDataItem,
} from '../models/types/ServerData';
import { Room } from '../models/Room';
import { Player } from '../models/Player';
import { GridCell } from '../models/enums/GridCell.enum';
import { GridCellData } from '../models/types/Game';
import { Coordinates } from '../models/types/ClientData';
import { EventType } from '../models/enums/Events.enum';

export function parseRawData(raw: RawData): WSMessage {
  const msg: WSMessage = JSON.parse(raw.toString());

  if (msg.data && typeof msg.data === 'string') {
    msg.data = JSON.parse(msg.data);
  }

  return msg;
}

export function stringifyData<T>(data: T): string {
  return JSON.stringify(data);
}

export function mapRooms(rooms: Room[]): ServerUpdateRoomDataItem[] {
  return rooms.map((room) => ({
    roomId: room.id,
    roomUsers: room.players.map((user) => ({
      name: user.name,
      index: user.index,
    })),
  }));
}

export function mapWinners(players: Player[]): ServerUpdateWinnersDataItem[] {
  return players.map((player) => ({
    name: player.name,
    wins: player.wins,
  }));
}

export function mapAttackResults(
  results: GridCellData[],
  playerIndex: number,
): ServerAttackData[] {
  return results.map((res) => ({
    ...res,
    currentPlayer: playerIndex,
  }));
}

export function getSize<T extends Object>(obj: T): number {
  return Object.entries(obj).length;
}

export function setCellValue(
  grid: string[][],
  y: number,
  x: number,
  value: GridCell,
) {
  grid[y]![x] = value;
}

export function getUUID(): string {
  return crypto.randomUUID();
}

export function isPlayerInRoom(
  players: Player[],
  playerIndex: number,
): boolean {
  return !!players.find((pl) => pl.index === playerIndex);
}

export function getMessage<T>(event: EventType, data: T): string {
  return stringifyData({
    type: event,
    data: stringifyData<T>(data),
    id: 0,
  });
}
