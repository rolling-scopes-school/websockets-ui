import { Commands, ExtendedWebSocket, Game, Position, PositionStatus, Room, RoomModified, Ship, ShipOption, User } from "./types";

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

export const addShips = (gameId: number, ships: ShipOption[], indexPlayer: number): void => {
    const game: Game = getGame(gameId);

    if (!game) {
        return;
    }

    if (indexPlayer === 0) {
        game.firstShips = updateShips(ships);
    } else {
        game.secondShips = updateShips(ships);
    }

    if (game.firstShips && game.secondShips) {
        [game.firstUser, game.secondUser].forEach((user: ExtendedWebSocket) => user.send(JSON.stringify({
            type: Commands.StartGame,
            data: JSON.stringify({
                ships: user === game.firstUser ? game.firstShips : game.secondShips,
                currentPlayerIndex: game.currentPlayer,
            }),
            id: 0,
        })));

        changeTurn(game, false);
    }
}

const getGame = (gameId: number): Game => {
    for (const room of rooms.values()) {
        if (room.game?.id === gameId) {
            return room.game;
        }
    }
}

const updateShips = (ships: ShipOption[]): Ship[] => {
    return ships.map((ship: ShipOption) => {
        const start: Position = ship.position;
        const points: PositionStatus[] = [];

        for (let i = 0; i < ship.length; i++) {
            ship.direction
                ? points.push({ x: start.x, y: start.y + i, status: true })
                : points.push({ x: start.x + i, y: start.y, status: true });
        }

        return {
            isKilled: false,
            points
        };
    });
}

const changeTurn = (game: Game, turn: boolean): void => {
    if (turn) {
        game.currentPlayer = game.currentPlayer === 0 ? 1 : 0;
    }

    [game.firstUser, game.secondUser].forEach((user: ExtendedWebSocket) => user.send(JSON.stringify({
        type: Commands.Turn,
        data: JSON.stringify({
            currentPlayer: game.currentPlayer,
        }),
        id: 0,
    })));
}
