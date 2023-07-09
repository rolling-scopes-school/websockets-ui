import { AttackedShip, Commands, ExtendedWebSocket, Game, Position, PositionStatus, Room, RoomModified, Ship, ShipOption, Status, User } from "./types";

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

export const attack = (x: number, y: number, gameId: number, indexPlayer: number): void => {
    const game: Game = getGame(gameId);

    if (game?.currentPlayer !== indexPlayer) {
        return;
    }

    const attackedShip: AttackedShip = gameAttack(game, x, y);

    if (!attackedShip) {
        return;
    }

    sendAttackResponse(game, x, y, indexPlayer, attackedShip.status);
    
    if (attackedShip.killedShip && attackedShip.status === Status.Killed) {
        sendMissMessagesAfterKill(game, attackedShip.killedShip, indexPlayer);
    }

    if (game.isFinished) {
        sendFinishGame(game, game.currentPlayer);
        removeRoom(gameId);
        updateRooms();
    } else {
        changeTurn(game, attackedShip.status === Status.Miss);
    }
}

const gameAttack = (game: Game, x: number, y: number): AttackedShip => {
    const shots: Position[] = game.currentPlayer === 0 ? game.firstShots : game.secondShots;
    const isRetry: boolean = shots.some((shot) => shot.x === x && shot.y === y);
    
    if (isRetry) {
        return;
    }

    shots.push({x, y});

    const ships: Ship[] = game.currentPlayer === 0 ? game.secondShips : game.firstShips;
    
    return hitShips(game, x, y, ships);
}

const sendAttackResponse = (game: Game, x: number, y: number, indexPlayer: number, status: Status): void => {
    [game.firstUser, game.secondUser].forEach((user: ExtendedWebSocket) => user.send(JSON.stringify({
        type: Commands.Attack,
        data: JSON.stringify({
            position: {
                x,
                y,
            },
            currentPlayer: indexPlayer,
            status,
        }),
        id: 0,
    })))
}

const sendMissMessagesAfterKill = (game: Game, ship: Ship, indexPlayer: number): void => {
    const sidesPositions: Position[] = getShipSidesPositions(ship);

    sidesPositions.forEach((point: Position) => {
        const result: boolean = addPositionToCurrentsShots(game, point);
        
        if (result) {
            sendAttackResponse(game, point.x, point.y, indexPlayer, Status.Miss);
        }
    });
}

const sendFinishGame = (game: Game, winPlayer: number): void => {
    [game.firstUser, game.secondUser].forEach((user: ExtendedWebSocket) => user.send(JSON.stringify({
        type: Commands.Finish,
        data: JSON.stringify({
            winPlayer,
        }),
        id: 0,
    })))
}

const removeRoom = (gameId: number): void => {
    let key: number;

    for (const entry of rooms.entries()) {
        if (entry[1].game?.id === gameId) {
            key = entry[0];
        }
    }

    if (key) {
        rooms.delete(key);
    }
}

const hitShips = (game: Game, x: number, y: number, ships: Ship[]): AttackedShip => {
    let status: Status = Status.Miss;
    let killedShip: Ship = null;

    ships.forEach((ship: Ship) => {
        if (ship.isKilled) {
            return;
        }

        let currentIsKilled: boolean = true;

        ship.points.forEach((point) => {
            if (point.x === x && point.y === y && point.status) {
                point.status = false;
                status = Status.Shot;
            }

            if (point.status) {
                currentIsKilled = false;
            }
        });

        if (currentIsKilled) {
            ship.isKilled = currentIsKilled;
            status = Status.Killed;
            killedShip = ship;
        }
    });

    game.isFinished = ships.every(ship => ship.isKilled);

    return {
        status,
        killedShip
    };
}

const getShipSidesPositions = (ship: Ship): Position[] => {
    const allSidesPositions: Position[] = [];
    
    ship.points.forEach((point) => {
        allSidesPositions.push(...getSidesPositions(point.x, point.y));
    });

    return allSidesPositions.filter((sidesPosition: Position) => {
        let result: boolean = true;

        ship.points.forEach(point => {
            if (sidesPosition.x === point.x && sidesPosition.y === point.y) {
                result = false;
            }
        })

        return result;
    });
}

const addPositionToCurrentsShots = (game: Game, point: Position): boolean => {
    const shots: Position[] = game.currentPlayer === 0 ? game.firstShots : game.secondShots;
    const isRetry: boolean = shots.some((shot: Position) => shot.x === point.x && shot.y === point.y);
    
    if (isRetry) {
        return false;
    }

    return !!shots.push(point);    
}

const getSidesPositions = (x: number, y: number): Position[] => {
    const points: Position[] = [];

    points.push({ x: x - 1, y });
    points.push({ x: x - 1, y: y - 1 });
    points.push({ x: x, y: y - 1 });
    points.push({ x: x + 1, y: y - 1 });
    points.push({ x: x + 1, y});
    points.push({ x: x + 1, y: y + 1 });
    points.push({ x: x, y: y + 1 });
    points.push({ x: x - 1, y: y + 1 });

    return points.filter((point: Position) => checkPosition(point.x, point.y));
}

const checkPosition = (x: number, y: number): boolean => !(x < 0 || x > 9  || y < 0 || y > 9);
