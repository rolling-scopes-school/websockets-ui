import { attack, changeTurn } from "./game";
import { getAllFreeRoms, getGame } from "./rooms";
import { getWinners } from "./winners";

import {
    Commands,
    ExtendedWebSocket,
    Game,
    Position,
    PositionStatus,
    RoomModified,
    Ship,
    ShipOption,
    User,
} from "../types";

let userIndex: number = 1;
const users: User[] = [];

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
    updateWinners();
}

export const updateRooms = (): void => {
    const data: RoomModified[] = getAllFreeRoms();    

    users.filter((user: User) => !user.inGame).forEach((user: User) => user.socket.send(JSON.stringify({
        type: Commands.UpdateRoom,
        data: JSON.stringify(data),
        id: 0,
    })));
}

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

export const randomAttack = (gameId: number, indexPlayer: number): void => {
    const game: Game = getGame(gameId);
    
    let position: Position = getRandomPosition();

    while (!checkRandomPosition(game, position)) {
        position = getRandomPosition();
    }

    attack(position.x, position.y, gameId, indexPlayer);
}

const getRandomPosition = (): Position => {
    const x: number = Math.ceil(Math.random() * 10) - 1;
    const y: number = Math.ceil(Math.random() * 10) - 1;

    return { x, y };
}

const checkRandomPosition = (game: Game, point: Position): boolean => {
    const shots: Position[] = game.currentPlayer === 0 ? game.firstShots : game.secondShots;
    
    return !shots.some((shot: Position) => shot.x === point.x && shot.y === point.y); 
}

export const updateWinners = (): void => {
    users.filter((user: User) => !user.inGame).forEach((user: User) => user.socket.send(
        JSON.stringify({
        type: Commands.UpdateWinners,
        data: JSON.stringify(getWinners()),
        id: 0,
    })));
}
