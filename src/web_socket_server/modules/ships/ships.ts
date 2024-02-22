import { WebSocket } from 'ws';
import { User } from '../users/user';
import { localUserShips } from '../../local_data_base/local.user.ships';
import {
    IUserFullShipsInterface,
    IUserShipsInterface,
} from '../../interface/user.ships.interface';
import { WebsocketTypes } from '../../enum/websocket.types';
import { localDataBase } from '../../local_data_base/local.data.base';
import { playersTurn } from '../game/game.module';
import { ReceivedDataInterface } from '../../interface/received.data.interface';
import { DeckStatus } from '../../enum/deck.status';

export const addUserShips = (
    ws: WebSocket,
    receivedData: ReceivedDataInterface,
    currentUser: User,
) => {
    // console.log(currentUser);
    // console.log(ws);
    const { data } = receivedData;
    const userDataWithShipsAndGameId: IUserShipsInterface = JSON.parse(data);
    const currentGameId = userDataWithShipsAndGameId.gameId;
    // console.log('currentGameId', currentGameId);

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
    let shipsData = {
        type: WebsocketTypes.START_GAME,
        data: JSON.stringify({
            ships: userDataWithShipsAndGameId.ships,
        }),
        indexPlayer: currentUser.getCurrentPlayer().index,
    };

    // console.log('shipsData', shipsData);

    ws.send(JSON.stringify(shipsData));

    const currentEnemyPlayer = localDataBase.find(
        (user) => user.index === enemyPlayer.indexPlayer,
    );

    // console.log('currentEnemyPlayer', currentEnemyPlayer);
    const currentEnemyPlayerShips = localUserShips.find(
        (userShips) => userShips.indexPlayer === currentEnemyPlayer?.index,
    );

    if (!currentEnemyPlayer?.ws) {
        return;
    }
    // console.log('currentEnemyPlayerShips', currentEnemyPlayerShips);
    shipsData = {
        type: WebsocketTypes.START_GAME,
        data: JSON.stringify({
            ships: currentEnemyPlayerShips,
        }),
        indexPlayer: currentEnemyPlayer.index,
    };

    currentEnemyPlayer.ws.send(JSON.stringify(shipsData));
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
        console.log('arrayWithCoordinates', arrayWithCoordinates);

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
