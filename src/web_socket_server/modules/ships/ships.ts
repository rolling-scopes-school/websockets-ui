import { WebSocket } from 'ws';

import { User } from '../users/user';
import { localUserShips } from '../../local_data_base/local.user.ships';
import {
    IPositionInterface,
    IShipsFullInterface,
    IUserFullShipsInterface,
    IUserShipsInterface,
} from '../../interface/user.ships.interface';
import { WebsocketTypes } from '../../enum/websocket.types';
import { localDataBase } from '../../local_data_base/local.data.base';
import { playersTurn } from '../game/game.module';
import { ReceivedDataInterface } from '../../interface/received.data.interface';
import { DeckStatus } from '../../enum/deck.status';
import { UserInterface } from '../../interface/user.interface';
import { getWsSendData } from '../../utils/stringify.data';

export const addUserShips = (
    ws: WebSocket,
    receivedData: ReceivedDataInterface,
    currentUser: User,
) => {
    const { data } = receivedData;
    const userDataWithShipsAndGameId: IUserShipsInterface = JSON.parse(data);
    const currentGameId = userDataWithShipsAndGameId.gameId;

    const enemyPlayer = localUserShips.find(
        (userShips) => userShips.gameId === currentGameId,
    );
    const userShipsWithCoordinates = getUserShipsCoordinates(
        userDataWithShipsAndGameId,
    );
    localUserShips.push(userShipsWithCoordinates);

    if (enemyPlayer) {
        startGame(ws, receivedData, currentUser, enemyPlayer);
    }
};

export const startGame = (
    ws: WebSocket,
    receivedData: any,
    currentUser: User,
    enemyPlayer: IUserFullShipsInterface,
) => {
    const { data } = receivedData;
    const userDataWithShipsAndGameId = JSON.parse(data);

    let wsData = getWsSendData(
        {
            ships: userDataWithShipsAndGameId.ships,
            indexPlayer: currentUser.getCurrentPlayer().index,
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
    playersTurn(currentUser.getCurrentPlayer());
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
