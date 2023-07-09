import { updateRooms, updateWinners } from "./users";
import { getGame, getRoom, removeRoom } from "./rooms";
import { addWin } from "./winners";

import {
    Game,
    AttackedShip,
    Status,
    Commands,
    ExtendedWebSocket,
    Room,
    Position,
    Ship
} from "../types";

let gameId: number = 1;

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
        sendFinishGame(game);
        removeRoom(gameId);

        const player = game.currentPlayer === 0 ? game.firstUser : game.secondUser;
        
        addWin(player.name || 'anonymous');
        updateRooms();
        updateWinners();
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

const sendFinishGame = (game: Game): void => {
    [game.firstUser, game.secondUser].forEach((user: ExtendedWebSocket) => user.send(JSON.stringify({
        type: Commands.Finish,
        data: JSON.stringify({
            winPlayer: game.currentPlayer,
        }),
        id: 0,
    })))
}

export const changeTurn = (game: Game, turn: boolean): void => {
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
