import { WebSocket } from 'ws';

import { localUserShips } from '../../local_data_base/local.user.ships';
import {
    IPositionInterface,
    IShipsFullInterface,
    IUserFullShipsInterface,
    IUserShipsInterface,
} from '../../interface/user.ships.interface';
import { WebsocketTypes } from '../../enum/websocket.types';
import { localDataBase } from '../../local_data_base/local.data.base';
import { playersTurn, startSingleGame } from '../game/game.module';
import { ReceivedDataInterface } from '../../interface/received.data.interface';
import { DeckStatus } from '../../enum/deck.status';
import { UserInterface } from '../../interface/user.interface';
import { getWsSendData } from '../../utils/stringify.data';
import { getBotShips } from './ships.for.single.game';
import { createBotTactics } from '../game/bot.tactics';

let botIndex = -1;

export const addUserShips = (
    ws: WebSocket,
    receivedData: ReceivedDataInterface,
) => {
    const { data } = receivedData;
    const userDataWithShipsAndGameId: IUserShipsInterface = JSON.parse(data);
    const { gameId, indexPlayer } = userDataWithShipsAndGameId;

    const currentUser = localDataBase.find(
        (users) => users.index === indexPlayer,
    );

    if (currentUser?.playWithBot) {
        return addUserShipsForSingleGame(
            ws,
            userDataWithShipsAndGameId,
            currentUser,
        );
    }

    const enemyPlayer = localUserShips.find(
        (userShips) =>
            userShips.gameId === gameId &&
            userShips.indexPlayer !== currentUser?.index,
    );

    const userShipsWithCoordinates = getUserShipsCoordinates(
        userDataWithShipsAndGameId,
    );

    localUserShips.push(userShipsWithCoordinates);

    if (enemyPlayer) {
        startGame(ws, receivedData, currentUser!, enemyPlayer);
    }
};

export const startGame = (
    ws: WebSocket,
    receivedData: any,
    currentUser: UserInterface,
    enemyPlayer: IUserFullShipsInterface,
) => {
    const { data } = receivedData;
    const userDataWithShipsAndGameId = JSON.parse(data);

    let wsData = getWsSendData(
        {
            ships: userDataWithShipsAndGameId.ships,
            indexPlayer: currentUser.index,
        },
        WebsocketTypes.START_GAME,
    );

    ws.send(wsData);

    const currentEnemyPlayer = localDataBase.find(
        (user) => user.index === enemyPlayer.indexPlayer,
    );

    const currentEnemyPlayerShips = localUserShips.find(
        (userShips) => userShips.indexPlayer === currentEnemyPlayer?.index,
    );

    wsData = getWsSendData(
        {
            ships: currentEnemyPlayerShips,
            currentPlayerIndex: currentEnemyPlayer?.index,
        },
        WebsocketTypes.START_GAME,
    );

    currentEnemyPlayer?.ws?.send(wsData);

    playersTurn(
        currentUser,
        currentEnemyPlayer!,
        currentEnemyPlayerShips!.gameId!,
    );
};

export const getUserShipsCoordinates = (
    shipsData: IUserShipsInterface,
): IUserFullShipsInterface => {
    const { ships } = shipsData;
    const shipsWithCoordinates = ships.map((ship) => {
        const {
            position: { x, y },
            direction,
            length,
        } = ship;
        const arrayWithCoordinates = [];

        if (!direction) {
            for (let i = 0; i < length; i++) {
                arrayWithCoordinates.push({
                    x: Number(x) + i,
                    y,
                    status: DeckStatus.DECK_INTACT,
                });
            }
        }

        if (direction) {
            for (let i = 0; i < length; i++) {
                arrayWithCoordinates.push({
                    x,
                    y: Number(y) + i,
                    status: DeckStatus.DECK_INTACT,
                });
            }
        }

        return {
            ...ship,
            position: [...arrayWithCoordinates],
        };
    });

    return {
        ...shipsData,
        ships: shipsWithCoordinates,
    };
};

export const updateUserShips = (
    enemyPlayer: UserInterface | undefined,
    ship: IShipsFullInterface[],
    attackPosition: IPositionInterface,
) => {
    const userShipIndex = localUserShips.findIndex(
        (item) => item.indexPlayer === enemyPlayer?.index,
    );
    const shipSet = new Set(ship.map((item) => JSON.stringify(item)));
    const filteredArray = localUserShips[userShipIndex]!.ships.filter(
        (item) => !shipSet.has(JSON.stringify(item)),
    );
    const shipPositionWithHitDeck = ship[0]!.position.map((item) => {
        if (item.x === attackPosition.x && item.y === attackPosition.y) {
            return {
                ...item,
                status: DeckStatus.HINT,
            };
        }
        return item;
    });

    const shipWithHitDeck = [
        {
            ...ship[0]!,
            position: shipPositionWithHitDeck,
        },
    ];

    const updatedUserShipsState: IUserFullShipsInterface = {
        ...localUserShips[userShipIndex],
        ships: [...filteredArray, ...[shipWithHitDeck[0]!]],
        gameId: localUserShips[userShipIndex]!.gameId,
        indexPlayer: localUserShips[userShipIndex]!.indexPlayer,
    };

    delete localUserShips[userShipIndex];
    localUserShips[userShipIndex] = updatedUserShipsState;
};

export const addUserShipsForSingleGame = (
    ws: WebSocket,
    shipData: IUserShipsInterface,
    player: UserInterface,
) => {
    const { gameId, ships } = shipData;

    const botPlayer: UserInterface = {
        name: `BotName${botIndex}`,
        password: '',
        index: botIndex,
    };

    localDataBase.push(botPlayer);

    const userShipsWithCoordinates = getUserShipsCoordinates(shipData);

    localUserShips.push(userShipsWithCoordinates);

    const botShipsData = getBotShips();

    localUserShips.push({
        gameId,
        ships: botShipsData,
        indexPlayer: botIndex,
    });

    botIndex -= 1;

    createBotTactics(gameId);

    return startSingleGame(ws, player, botPlayer, ships, gameId);
};
