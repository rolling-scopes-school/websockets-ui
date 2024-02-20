import { WebsocketTypes } from '../../enum/websocket.types';
import { WebSocket } from 'ws';
import { User } from '../users/user';
import { localUserShips } from '../../local_data_base/local.user.ships';
import { ShipStatuses } from '../../enum/ship.statuses';
import { localDataBase } from '../../local_data_base/local.data.base';

export const playersTurn = (currentUser: User) => {
    const user = currentUser.getCurrentPlayer();
    const data = {
        type: WebsocketTypes.TURN,
        data: JSON.stringify({
            currentPlayer: user.index,
        }),
        id: 0,
    };
    console.log('TURN');
    if (!user?.ws) {
        return;
    }
    user?.ws.send(JSON.stringify(data));
};

export const playerAttack = (
    ws: WebSocket,
    receivedData: any,
    currentUser: User,
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
    console.log('enemyPlayer', enemyPlayer);

    const getShip = shipData.ships.filter(
        (ship) => ship.position.x === x && ship.position.y === y,
    );
    console.log('ship', getShip);

    if (getShip.length === 0) {
        console.log('ship', getShip);
    }

    const attackData = {
        type: WebsocketTypes.ATTACK,
        data: {
            position: {
                x,
                y,
            },
            currentPlayer: currentUser.getCurrentPlayer().index,
            status: ShipStatuses.MISS,
        },
        id: 0,
    };

    ws.send(JSON.stringify(attackData));
};
