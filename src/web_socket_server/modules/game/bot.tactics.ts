import { IPositionInterface } from '../../interface/user.ships.interface';
import { listOfBotHits } from '../../local_data_base/local.bot.hits';
import { WebsocketTypes } from '../../enum/websocket.types';
import { UserInterface } from '../../interface/user.interface';
import { playerAttack } from './game.module';
import {BotHitsInterface} from "../../interface/bot.hits.interface";

const getShotCoordinate = (gameId: number): IPositionInterface | null => {
    const currentGameHitsIndex = listOfBotHits.findIndex(
        (gameHits) => gameHits.gameId === gameId,
    );

    if (currentGameHitsIndex === -1) {
        return null;
    }

    const { botHits, aroundHits } = listOfBotHits[currentGameHitsIndex]!;

    if (aroundHits.length > 0) {
        console.log('aroundHits', aroundHits);
        const index = Math.floor(Math.random() * (aroundHits.length - 0)) + 0;

        const aroundHitsSet = new Set(
            [aroundHits[index]].map((item) => JSON.stringify(item)),
        );

        const botHitsWithoutThisHits = aroundHits.filter(
            (item) => !aroundHitsSet.has(JSON.stringify(item)),
        );

        const updatedBotHits = {
            aroundHits: botHitsWithoutThisHits,
            gameId,
            botHits,
        };

        delete listOfBotHits[currentGameHitsIndex];
        listOfBotHits[currentGameHitsIndex] = updatedBotHits;

        return aroundHits[index] as IPositionInterface;
    }

    if (botHits.length > 0) {
        const index = Math.floor(Math.random() * (botHits.length - 0)) + 0;

        const botHitsSet = new Set(
            [botHits[index]].map((item) => JSON.stringify(item)),
        );

        const botHitsWithoutThisHits = botHits.filter(
            (item) => !botHitsSet.has(JSON.stringify(item)),
        );

        const updatedBotHits = {
            aroundHits,
            gameId,
            botHits: botHitsWithoutThisHits,
        };

        delete listOfBotHits[currentGameHitsIndex];
        listOfBotHits[currentGameHitsIndex] = updatedBotHits;

        return botHits[index] as IPositionInterface;
    }
};

export const botTactics = (
    gameId: number,
    currentUser: UserInterface,
    enemyPlayer: UserInterface,
    attackPosition?: IPositionInterface,
) => {
    if (attackPosition) {
        createHitCoordinates(attackPosition, gameId);
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
    });
};

export const createHitCoordinates = (
    attackPosition: IPositionInterface,
    gameId: number,
) => {
    const { x, y } = attackPosition;
    let coordinatesWithoutShip = [
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y + 1 },
    ];
    coordinatesWithoutShip = coordinatesWithoutShip.filter(
        (item) => item.x >= 0 && item.y >= 0,
    );


    const currentSessionIndex = listOfBotHits.findIndex((item) => item.gameId === gameId);

    const { botHits, firstHit } = listOfBotHits[currentSessionIndex]!;

    const hitsSet = new Set(coordinatesWithoutShip.map((item) => JSON.stringify(item)));
    const filteredArray = botHits.filter(
        (item) => !hitsSet.has(JSON.stringify(item)),
    );

    let coordinatesWithShip = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
    ];

    coordinatesWithShip = coordinatesWithShip.filter(
        (item) => item.x >= 0 && item.y >= 0,
    );

    if (firstHit.length > 0) {
        const { x: firstHitX, y: firstHitY } = firstHit[0]!;

        if (x !== firstHitX  && y !== firstHitY) {

        }
    }

    const updatedHits: BotHitsInterface = {
        gameId,
        aroundHits: coordinatesWithShip,
        botHits: filteredArray,
        firstHit: [attackPosition]
    };

    delete listOfBotHits[currentSessionIndex];
    listOfBotHits[currentSessionIndex] = updatedHits;
};

export const removeBotHits = (gameId: number) => {
    const currentSessionIndex = listOfBotHits.findIndex((item) => item.gameId === gameId);
    const { botHits } = listOfBotHits[currentSessionIndex]!;

    const updatedHits: BotHitsInterface = {
        gameId,
        aroundHits: [],
        botHits,
        firstHit: []
    };

    delete listOfBotHits[currentSessionIndex];
    listOfBotHits[currentSessionIndex] = updatedHits;
}