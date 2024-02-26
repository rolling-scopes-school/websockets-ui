import { IPositionInterface } from '../../interface/user.ships.interface';
import { listOfBotHits } from '../../local_data_base/local.bot.hits';
import { WebsocketTypes } from '../../enum/websocket.types';
import { UserInterface } from '../../interface/user.interface';
import { playerAttack } from './game.module';
import { BotHitsInterface } from '../../interface/bot.hits.interface';
import { listOfPlayersTurn } from '../../local_data_base/local.list.of.players.turn';
import { localUserShips } from '../../local_data_base/local.user.ships';
import { IPlayerInterface } from '../../interface/list.of.players.turn.interface';
import { ShipStatuses } from '../../enum/ship.statuses';

const getShotCoordinate = (gameId: number): IPositionInterface | null => {
    const currentGameHitsIndex = listOfBotHits.findIndex(
        (gameHits) => gameHits.gameId === gameId,
    );

    if (currentGameHitsIndex === -1) {
        return null;
    }

    const { botHits, aroundHits, firstHit } =
        listOfBotHits[currentGameHitsIndex]!;

    const listOfPlayersTurnIndex = listOfPlayersTurn.findIndex(
        (item) => item.gameId === gameId,
    );

    const { indexPlayer } = localUserShips.find(
        (item) => item.gameId === gameId && item.indexPlayer < 0,
    )!;

    const botHitsData = listOfPlayersTurn[listOfPlayersTurnIndex]![
        indexPlayer
    ]! as IPlayerInterface;
    const { playerTurns } = botHitsData;

    if (aroundHits.length > 0) {
        const botHitsSet = new Set(
            aroundHits.map((item) => JSON.stringify(item)),
        );

        const botHitsWithoutThisHits = playerTurns.filter((item) =>
            botHitsSet.has(JSON.stringify(item)),
        );

        if (botHitsWithoutThisHits.length > 0) {
            const index =
                Math.floor(
                    Math.random() * (botHitsWithoutThisHits.length - 0),
                ) + 0;

            const updatedBotHits = {
                aroundHits: botHitsWithoutThisHits,
                gameId,
                botHits,
                firstHit,
            };

            delete listOfBotHits[currentGameHitsIndex];
            listOfBotHits[currentGameHitsIndex] = updatedBotHits;

            return botHitsWithoutThisHits[index] as IPositionInterface;
        } else {
            const index =
                Math.floor(Math.random() * (playerTurns.length - 0)) + 0;

            const updatedBotHits = {
                aroundHits: [],
                gameId,
                botHits,
                firstHit,
            };

            delete listOfBotHits[currentGameHitsIndex];
            listOfBotHits[currentGameHitsIndex] = updatedBotHits;

            return playerTurns[index] as IPositionInterface;
        }
    }

    if (botHits.length > 0) {
        const botHitsSet = new Set(botHits.map((item) => JSON.stringify(item)));

        const botHitsWithoutThisHits = playerTurns.filter((item) =>
            botHitsSet.has(JSON.stringify(item)),
        );

        if (botHitsWithoutThisHits.length > 0) {
            const index =
                Math.floor(
                    Math.random() * (botHitsWithoutThisHits.length - 0),
                ) + 0;

            const updatedBotHits = {
                aroundHits,
                gameId,
                botHits: botHitsWithoutThisHits,
                firstHit,
            };

            delete listOfBotHits[currentGameHitsIndex];
            listOfBotHits[currentGameHitsIndex] = updatedBotHits;

            return botHits[index] as IPositionInterface;
        } else {
            const index =
                Math.floor(Math.random() * (playerTurns.length - 0)) + 0;

            const updatedBotHits = {
                aroundHits,
                gameId,
                botHits: [],
                firstHit,
            };

            delete listOfBotHits[currentGameHitsIndex];
            listOfBotHits[currentGameHitsIndex] = updatedBotHits;

            return playerTurns[index] as IPositionInterface;
        }
    }

    const index = Math.floor(Math.random() * (playerTurns.length - 0)) + 0;
    return playerTurns[index] as IPositionInterface;
};
export const botTactics = (
    gameId: number,
    currentUser: UserInterface,
    enemyPlayer: UserInterface,
    status: ShipStatuses,
    attackPosition?: IPositionInterface,
) => {
    if (attackPosition) {
        createHitCoordinates(attackPosition, gameId, status);
    }

    const coordinates = getShotCoordinate(gameId);

    if (!coordinates) {
        return;
    }

    const data = {
        type: WebsocketTypes.ATTACK,
        data: JSON.stringify({
            gameId,
            x: coordinates.x,
            y: coordinates.y,
            indexPlayer: enemyPlayer.index,
        }),
        id: 0,
    };

    playerAttack(currentUser.ws!, data);
};

export const createBotTactics = (gameId: number) => {
    const firstHitsArray = [
        [6, 0],
        [2, 0],
        [0, 2],
        [0, 6],
    ];
    const secondHitsArray = [
        [3, 0],
        [7, 0],
        [9, 2],
        [9, 6],
    ];

    const aroundHits = [] as IPositionInterface[];
    const botHits = [] as IPositionInterface[];

    for (const arr of firstHitsArray) {
        let x = arr[0]!;
        let y = arr[1]!;

        while (x <= 9 && y <= 9) {
            botHits.push({ x, y });
            x++;
            y++;
        }
    }

    for (const arr of secondHitsArray) {
        let x = arr[0]!;
        let y = arr[1]!;

        while (x >= 0 && x <= 9 && y <= 9) {
            botHits.push({ x, y });
            x--;
            y++;
        }
    }

    listOfBotHits.push({
        botHits,
        aroundHits,
        gameId,
        firstHit: [],
    });
};

export const createHitCoordinates = (
    attackPosition: IPositionInterface,
    gameId: number,
    status: ShipStatuses,
) => {
    const currentSessionIndex = listOfBotHits.findIndex(
        (item) => item.gameId === gameId,
    );

    const { botHits, firstHit, aroundHits } =
        listOfBotHits[currentSessionIndex]!;
    const { x, y } = attackPosition;

    let coordinatesWithShip = [] as IPositionInterface[];
    let coordinatesWithoutShip = [] as IPositionInterface[];

    if (status === ShipStatuses.SHOT) {
        coordinatesWithShip = [
            { x: x - 1, y },
            { x: x + 1, y },
            { x, y: y - 1 },
            { x, y: y + 1 },
        ];

        coordinatesWithShip = coordinatesWithShip.filter(
            (item) => item.x >= 0 && item.x <= 9 && item.y >= 0 && item.y <= 9,
        );

        coordinatesWithoutShip = [
            { x: x - 1, y: y - 1 },
            { x: x - 1, y: y + 1 },
            { x: x + 1, y: y - 1 },
            { x: x + 1, y: y + 1 },
        ];

        coordinatesWithoutShip = coordinatesWithoutShip.filter(
            (item) => item.x >= 0 && item.x <= 9 && item.y >= 0 && item.y <= 9,
        );
    }

    if (firstHit.length > 0) {
        const { x: firstHitX, y: firstHitY } = firstHit[0]!;

        if (x === firstHitX) {
            let newAroundHits = [
                { x, y: y + 1 },
                { x, y: y - 1 },
            ];
            const updatedAroundHits = aroundHits.filter(
                (item) => item.x === firstHitX,
            );
            newAroundHits = newAroundHits.filter(
                (item) => item.x !== firstHitX && item.y !== firstHitY,
            );
            const result = newAroundHits.concat(updatedAroundHits);

            if (result.length === 0) {
                let beginningAndEndOfShip = [
                    { x, y: y - 2 },
                    { x, y: y + 2 },
                ];
                beginningAndEndOfShip = beginningAndEndOfShip.filter(
                    (item) =>
                        item.x >= 0 &&
                        item.x <= 9 &&
                        item.y >= 0 &&
                        item.y <= 9,
                );
                coordinatesWithShip.push(...beginningAndEndOfShip);
            }

            const currentAroundHits = hitsSynchronization(result, gameId);
            coordinatesWithShip = currentAroundHits;
        }

        if (y === firstHitY) {
            let newAroundHits = [
                { x: x - 1, y },
                { x: x + 1, y },
            ];
            const updatedAroundHits = aroundHits.filter(
                (item) => item.y === firstHitY,
            );
            newAroundHits = newAroundHits.filter(
                (item) => item.x !== firstHitX && item.y !== firstHitY,
            );
            const result = newAroundHits.concat(updatedAroundHits);
            if (result.length === 0) {
                let beginningAndEndOfShip = [
                    { x: x + 2, y },
                    { x: x - 2, y },
                ];
                beginningAndEndOfShip = beginningAndEndOfShip.filter(
                    (item) =>
                        item.x >= 0 &&
                        item.x <= 9 &&
                        item.y >= 0 &&
                        item.y <= 9,
                );
                coordinatesWithShip.push(...beginningAndEndOfShip);
            }

            const currentAroundHits = hitsSynchronization(result, gameId);
            coordinatesWithShip = currentAroundHits;
        }
    }

    const hitsSet = new Set(
        coordinatesWithoutShip.map((item) => JSON.stringify(item)),
    );
    const filteredArray = botHits.filter(
        (item) => !hitsSet.has(JSON.stringify(item)),
    );

    const updatedHits: BotHitsInterface = {
        gameId,
        aroundHits: coordinatesWithShip,
        botHits: filteredArray,
        firstHit: [attackPosition],
    };

    delete listOfBotHits[currentSessionIndex];
    listOfBotHits[currentSessionIndex] = updatedHits;
};

export const removeBotHits = (gameId: number) => {
    const currentSessionIndex = listOfBotHits.findIndex(
        (item) => item.gameId === gameId,
    );
    const { botHits } = listOfBotHits[currentSessionIndex]!;

    const updatedHits: BotHitsInterface = {
        gameId,
        aroundHits: [],
        botHits,
        firstHit: [],
    };

    delete listOfBotHits[currentSessionIndex];
    listOfBotHits[currentSessionIndex] = updatedHits;
};

export const updateBotHits = (
    positions: IPositionInterface[],
    gameId: number,
) => {
    const botListOfHitsIndex = listOfPlayersTurn.findIndex(
        (item) => (item.gameId = gameId),
    );
    const botHitsDataFromDb = listOfPlayersTurn[botListOfHitsIndex];

    const { indexPlayer } = localUserShips.find(
        (item) => item.gameId === gameId && item.indexPlayer < 0,
    )!;

    const botHitsData = listOfPlayersTurn[botListOfHitsIndex]![
        indexPlayer
    ]! as IPlayerInterface;
    const { playerTurns } = botHitsData;

    const hitsSet = new Set(positions.map((item) => JSON.stringify(item)));
    const filteredArray = playerTurns.filter(
        (item) => !hitsSet.has(JSON.stringify(item)),
    );

    delete listOfPlayersTurn[botListOfHitsIndex];

    listOfPlayersTurn[botListOfHitsIndex] = {
        ...botHitsDataFromDb,
        gameId,
        [indexPlayer]: {
            indexPlayer,
            playerTurns: filteredArray,
        },
        indexPlayer: botHitsDataFromDb!.indexPlayer,
    };
};

const hitsSynchronization = (
    positions: IPositionInterface[],
    gameId: number,
) => {
    const botListOfHitsIndex = listOfPlayersTurn.findIndex(
        (item) => (item.gameId = gameId),
    );
    const { indexPlayer } = localUserShips.find(
        (item) => item.gameId === gameId && item.indexPlayer < 0,
    )!;

    const botHitsData = listOfPlayersTurn[botListOfHitsIndex]![
        indexPlayer
    ]! as IPlayerInterface;
    const { playerTurns } = botHitsData;

    const hitsSet = new Set(playerTurns.map((item) => JSON.stringify(item)));
    const filteredArray = positions.filter((item) =>
        hitsSet.has(JSON.stringify(item)),
    );

    return filteredArray;
};
