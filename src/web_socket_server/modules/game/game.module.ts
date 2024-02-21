import { WebsocketTypes } from '../../enum/websocket.types';
import { WebSocket } from 'ws';
// import { User } from '../users/user';
import { localUserShips } from '../../local_data_base/local.user.ships';
import { ShipStatuses } from '../../enum/ship.statuses';
import { localDataBase } from '../../local_data_base/local.data.base';
import { UserInterface } from '../../interface/user.interface';
import { ReceivedDataInterface } from '../../interface/received.data.interface';

// const hittingShip = () => {};

export const playersTurn = (currentUser: UserInterface) => {
    const data = {
        type: WebsocketTypes.TURN,
        data: JSON.stringify({
            currentPlayer: currentUser.index,
        }),
        id: 0,
    };

    if (!currentUser?.ws) {
        return;
    }
    currentUser?.ws.send(JSON.stringify(data));
};

export const playerAttack = (
    ws: WebSocket,
    receivedData: ReceivedDataInterface,
) => {
    const { data } = receivedData;
    const { gameId, x, y, indexPlayer } = JSON.parse(data);

    const shipData = localUserShips.find(
        (userShip) =>
            userShip.gameId === gameId && userShip.indexPlayer !== indexPlayer,
    );

    if (!shipData) {
        return;
    }

    const enemyId = shipData.indexPlayer;
    const enemyPlayer = localDataBase.find((users) => users.index === enemyId);
    const currentPlayer = localDataBase.find(
        (users) => users.index === indexPlayer,
    );
    // console.log('enemyPlayer', enemyPlayer);

    const getShip = shipData.ships.filter(
        (ship) => ship.position.x === x && ship.position.y === y,
    );
    // console.log('ship', getShip);

    if (getShip.length !== 0) {
        console.log('ship', getShip);
    }

    let attackData = {
        type: WebsocketTypes.ATTACK,
        data: JSON.stringify({
            position: {
                x,
                y,
            },
            currentPlayer: currentPlayer?.index,
            status: ShipStatuses.MISS,
        }),
        id: 0,
    };

    ws.send(JSON.stringify(attackData));

    if (!enemyPlayer?.ws) {
        return;
    }

    attackData = {
        type: WebsocketTypes.ATTACK,
        data: JSON.stringify({
            position: {
                x,
                y,
            },
            currentPlayer: currentPlayer?.index,
            status: ShipStatuses.MISS,
        }),
        id: 0,
    };

    enemyPlayer.ws.send(JSON.stringify(attackData));

    playersTurn(enemyPlayer);
};

// export const randomAttack = (
//     ws: WebSocket,
//     receivedData: any,
//     currentUser: User,
// ) => {
//     console.log(ws)
//     console.log(receivedData)
//     console.log(currentUser)
// }
