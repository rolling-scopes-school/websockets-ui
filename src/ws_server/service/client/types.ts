export enum messageType {
  error = "error",
  reg = "ref",
}

export interface MessageType<T> {
  type: string;
  data: T;
  id: number;
}

export interface User {
  name: string;
  password: string;
  room?: number;
}

export type RegResponse<T> = T extends "error"
  ? {
      name: string;
      index: number;
      error: boolean;
    }
  : {
      error: boolean;
      errorText: string;
    };

export type RoomData = {
  roomId: number;
  roomUsers: { name: string; index: number }[];
};
