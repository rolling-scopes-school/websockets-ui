import { WebsocketTypes } from '../../enum/websocket.types';
import { WebSocket } from 'ws';
// import { User } from '../users/user';
import { localUserShips } from '../../local_data_base/local.user.ships';
import { ShipStatuses } from '../../enum/ship.statuses';
import { localDataBase } from '../../local_data_base/local.data.base';
import { UserInterface } from '../../interface/user.interface';
import {
    IAttackData,
    ReceivedDataInterface,
} from '../../interface/received.data.interface';
import { IShipsFullInterface } from '../../interface/user.ships.interface';
import { ShipsTypes } from '../../enum/ships.types';

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
    const parsedData = JSON.parse(data);
    const { gameId, x, y, indexPlayer } = parsedData;

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

    const currentShip = shipData.ships.filter((ship) =>
        ship.position.find((position) => position.x === x && position.y === y),
    );
    console.log('ship', currentShip[0]?.position);

    if (currentShip.length !== 0) {
        console.log('-----------------------------')
        console.log('currentShip', currentShip);
        return getHitData(
            currentShip,
            parsedData,
            enemyPlayer,
            currentPlayer
        );
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

const getHitData = (
    ship: IShipsFullInterface[],
    data: IAttackData,
    enemyPlayer: UserInterface | undefined,
    currentPlayer: UserInterface | undefined
) => {
    const shipType = ship[0]!.type;
    const { gameId, x, y, indexPlayer } = data;

    console.log('gameId', gameId);
    console.log('indexPlayer', indexPlayer);

    if (shipType === ShipsTypes.SMALL) {
        let attackData = {
            type: WebsocketTypes.ATTACK,
            data: JSON.stringify({
                position: {
                    x,
                    y,
                },
                currentPlayer: currentPlayer?.index,
                status: ShipStatuses.KILLED,
            }),
            id: 0,
        };

        if (!currentPlayer?.ws) {
            return;
        }

        currentPlayer.ws.send(JSON.stringify(attackData));

        attackData = {
            type: WebsocketTypes.ATTACK,
            data: JSON.stringify({
                position: {
                    x,
                    y,
                },
                currentPlayer: currentPlayer?.index,
                status: ShipStatuses.KILLED,
            }),
            id: 0,
        };

        if (!enemyPlayer?.ws) {
            return;
        }

        enemyPlayer.ws.send(JSON.stringify(attackData));

        const borderCoordinates = addingBorderAroundShip(ship);

        for (let coordinate of borderCoordinates) {
            const borderData = {
                type: WebsocketTypes.ATTACK,
                data: JSON.stringify({
                    position: {
                        x: coordinate.x,
                        y: coordinate.y,
                    },
                    currentPlayer: currentPlayer?.index,
                    status: ShipStatuses.MISS,
                }),
                id: 0,
            }
            currentPlayer.ws.send(JSON.stringify(borderData));
            enemyPlayer.ws.send(JSON.stringify(borderData));
        }
        playersTurn(currentPlayer!);
    }

    if (shipType === ShipsTypes.MEDIUM) {

    }

    if (shipType === ShipsTypes.LARGE) {

    }

    if (shipType === ShipsTypes.HUGE) {

    }
};

const addingBorderAroundShip = (
    ship: IShipsFullInterface[]
) => {
    const currentShip = ship[0]!;
    const { position, direction, length } = currentShip;

    const coordinates = position.map(item => {
        return {
            x: item.x,
            y: item.y
        }
    });

    console.log('coordinates', coordinates);

    let arrWithBorderCoordinates = [];

    const  { x, y } = coordinates[0]!;

    if (direction) {
        let currentY = y;

        for (let i = 0; i < length + 2; i++) {
            arrWithBorderCoordinates.push({ x: x - 1, y: currentY - 1 }, { x, y: currentY - 1 }, { x: x + 1, y: currentY - 1});
            currentY++;
        }
    }

    if (!direction) {
        let currentX = x;

        for (let i = 0; i < length + 2; i++) {
            arrWithBorderCoordinates.push({ x: currentX - 1, y: y - 1 }, { x: currentX - 1, y }, { x: currentX - 1, y: y + 1});
            currentX++;
        }
    }
    console.log('arrWithBorderCoordinates', arrWithBorderCoordinates)
    arrWithBorderCoordinates = arrWithBorderCoordinates.filter(item => item.x >= 0 && item.y >= 0);

    const coordinatesSet = new Set(coordinates.map(item => JSON.stringify(item)));
    const filteredArray = arrWithBorderCoordinates.filter(item => !coordinatesSet.has(JSON.stringify(item)));
    console.log('filteredArray', filteredArray)
    return filteredArray;
}

// export const randomAttack = (
//     ws: WebSocket,
//     receivedData: any,
//     currentUser: User,
// ) => {
//     console.log(ws)
//     console.log(receivedData)
//     console.log(currentUser)
// }
