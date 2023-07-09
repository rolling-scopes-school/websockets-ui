import { Commands, ExtendedWebSocket, Game, Room, RoomModified, User } from "./types";

let userIndex: number = 1;
const users: User[] = [];
const rooms: Map<number, Room> = new Map();
let roomId: number = 1;
let gameId: number = 1;

export const createUser = (name: string, password: string, socket: ExtendedWebSocket): void => {
    const index: number = userIndex++;

    socket.name = name;
    socket.id = index;

    users.push({ name, password, socket, inGame: false });

    socket.send(JSON.stringify({
        type: Commands.Registration,
        data: JSON.stringify({
            name,
            index,
            error: false,
            errorText: "",
        }),
        id: 0,
    }));

    updateRooms();
}

export const updateRooms = (): void => {
    const data: RoomModified[] = getAllFreeRoms();    

    users.filter((user: User) => !user.inGame).forEach((user: User) => user.socket.send(JSON.stringify({
        type: Commands.UpdateRoom,
        data: JSON.stringify(data),
        id: 0,
    })));
}


const getAllFreeRoms = (): RoomModified[] => {
    const roomsArr: RoomModified[]  = [];

    rooms.forEach((value, key) => {
        if (value.secondPlayer) {
            return;
        }

        roomsArr.push({
            roomId: key,
            roomUsers: [{
                name: value.firstPlayer.name,
                index: value.firstPlayer.id
            }]
        })
    });

    return roomsArr;
}

export const createRoom = (firstPlayer: ExtendedWebSocket): void => {
    const id: number = roomId++;
    const room: Room = {
        id,
        firstPlayer,
        secondPlayer: null,
        game: null,
    };

    rooms.set(id, room);

    updateRooms();
}

export const addUser = (roomId: number, secondPlayer: ExtendedWebSocket): void => {
    const room: Room = getRoom(roomId);
    
    if (!room || room.firstPlayer.id == secondPlayer.id || room.secondPlayer) {
        return;
    }
    
    room.secondPlayer = secondPlayer;

    const game: Game = {
        id: gameId++,
        firstUser: room.firstPlayer,
        secondUser: room.secondPlayer,
        firstShips: [],
        secondShips: [],
        firstShots: [],
        secondShots: [],
        currentPlayer: (Math.ceil(Math.random() * 2) - 1),
        isFinished: false,
    };

    room.game = game;

    [room.firstPlayer, room.secondPlayer].forEach((player: ExtendedWebSocket, index: number) => player.send(JSON.stringify({
        type: Commands.CreateGame,
        data: JSON.stringify({
            idGame: game.id,
            idPlayer: index,
        }),
        id: 0,
    })));
}

const getRoom = (id: number): Room => rooms.get(id);

