import { WebSocket } from 'ws';

import { WebsocketTypes } from '../../enum/websocket.types';
import { localUserShips } from '../../local_data_base/local.user.ships';
import { ShipStatuses } from '../../enum/ship.statuses';
import { localDataBase } from '../../local_data_base/local.data.base';
import { UserInterface } from '../../interface/user.interface';
import {
    IAttackData,
    ReceivedDataInterface,
} from '../../interface/received.data.interface';
import {
    IPositionInterface,
    IShipsFullInterface,
} from '../../interface/user.ships.interface';
import { ShipsTypes } from '../../enum/ships.types';
import { DeckStatus } from '../../enum/deck.status';
import { updateUserShips } from '../ships/ships';
import { updateWinners } from '../users/user.module';
import { getWsSendData } from '../../utils/stringify.data';

export const playersTurn = (currentUser: UserInterface) => {
    const wsData = getWsSendData(
        {
            currentPlayer: currentUser.index,
        },
        WebsocketTypes.TURN,
    );

    currentUser.ws?.send(wsData);
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

    const enemyId = shipData!.indexPlayer;
    const enemyPlayer = localDataBase.find((users) => users.index === enemyId);
    const currentPlayer = localDataBase.find(
        (users) => users.index === indexPlayer,
    );

    const currentShip = shipData!.ships.filter((ship) =>
        ship.position.find((position) => position.x === x && position.y === y),
    );

    if (currentShip.length !== 0) {
        return getHitData(
            currentShip,
            parsedData,
            enemyPlayer!,
            currentPlayer!,
        );
    }

    const wsData = getWsSendData(
        {
            position: {
                x,
                y,
            },
            currentPlayer: currentPlayer?.index,
            status: ShipStatuses.MISS,
        },
        WebsocketTypes.ATTACK,
    );

    ws.send(wsData);

    enemyPlayer!.ws?.send(wsData);

    playersTurn(enemyPlayer!);
};

const getHitData = (
    ship: IShipsFullInterface[],
    data: IAttackData,
    enemyPlayer: UserInterface,
    currentPlayer: UserInterface,
) => {
    const shipType = ship[0]!.type;
    const { x, y } = data;

    if (shipType === ShipsTypes.SMALL) {
        const wsData = getWsSendData(
            {
                position: {
                    x,
                    y,
                },
                currentPlayer: currentPlayer?.index,
                status: ShipStatuses.KILLED,
            },
            WebsocketTypes.ATTACK,
        );

        currentPlayer.ws!.send(wsData);
        enemyPlayer.ws!.send(wsData);

        const borderCoordinates = addingBorderAroundShip(ship);

        for (const coordinate of borderCoordinates) {
            const wsData = getWsSendData(
                {
                    position: {
                        x: coordinate.x,
                        y: coordinate.y,
                    },
                    currentPlayer: currentPlayer?.index,
                    status: ShipStatuses.MISS,
                },
                WebsocketTypes.ATTACK,
            );

            currentPlayer.ws!.send(wsData);
            enemyPlayer.ws!.send(wsData);
        }

        updateUserShips(enemyPlayer, ship, { x, y });
        playersTurn(currentPlayer!);
    }

    checkShipDecks(ship, enemyPlayer, currentPlayer, { x, y });
};

const addingBorderAroundShip = (ship: IShipsFullInterface[]) => {
    const currentShip = ship[0]!;
    const { position, direction, length } = currentShip;

    const coordinates = position.map((item) => {
        return {
            x: item.x,
            y: item.y,
        };
    });

    let arrWithBorderCoordinates = [];

    const { x, y } = coordinates[0]!;

    if (direction) {
        let currentY = y;

        for (let i = 0; i < length + 2; i++) {
            arrWithBorderCoordinates.push(
                { x: x - 1, y: currentY - 1 },
                { x, y: currentY - 1 },
                { x: x + 1, y: currentY - 1 },
            );
            currentY++;
        }
    }

    if (!direction) {
        let currentX = x;

        for (let i = 0; i < length + 2; i++) {
            arrWithBorderCoordinates.push(
                { x: currentX - 1, y: y - 1 },
                { x: currentX - 1, y },
                { x: currentX - 1, y: y + 1 },
            );
            currentX++;
        }
    }

    arrWithBorderCoordinates = arrWithBorderCoordinates.filter(
        (item) => item.x >= 0 && item.y >= 0,
    );

    const coordinatesSet = new Set(
        coordinates.map((item) => JSON.stringify(item)),
    );
    return arrWithBorderCoordinates.filter(
        (item) => !coordinatesSet.has(JSON.stringify(item)),
    );
};

const checkShipDecks = (
    ship: IShipsFullInterface[],
    enemyPlayer: UserInterface,
    currentPlayer: UserInterface,
    attackPosition: IPositionInterface,
) => {
    const wsData = getWsSendData(
        {
            position: {
                x: attackPosition.x,
                y: attackPosition.y,
            },
            currentPlayer: currentPlayer?.index,
            status: ShipStatuses.SHOT,
        },
        WebsocketTypes.ATTACK,
    );

    currentPlayer.ws!.send(wsData);
    enemyPlayer.ws!.send(wsData);

    updateUserShips(enemyPlayer, ship, attackPosition);

    const userShips = localUserShips.find(
        (item) => item.indexPlayer === enemyPlayer?.index,
    );
    const currentShip = userShips!.ships.filter((ship) =>
        ship.position.find(
            (position) =>
                position.x === attackPosition.x &&
                position.y === attackPosition.y,
        ),
    );

    const isShipIntact =
        currentShip[0]!.position.filter(
            (item) => item.status === DeckStatus.DECK_INTACT,
        ).length >= 1;

    if (!isShipIntact) {
        for (const position of ship[0]!.position) {
            const wsData = getWsSendData(
                {
                    position: {
                        x: position.x,
                        y: position.y,
                    },
                    currentPlayer: currentPlayer?.index,
                    status: ShipStatuses.KILLED,
                },
                WebsocketTypes.ATTACK,
            );

            currentPlayer.ws!.send(wsData);
            enemyPlayer.ws!.send(wsData);
        }

        const borderCoordinates = addingBorderAroundShip(currentShip);

        for (const coordinate of borderCoordinates) {
            const wsData = getWsSendData(
                {
                    position: {
                        x: coordinate.x,
                        y: coordinate.y,
                    },
                    currentPlayer: currentPlayer?.index,
                    status: ShipStatuses.MISS,
                },
                WebsocketTypes.ATTACK,
            );

            currentPlayer.ws!.send(wsData);
            enemyPlayer.ws!.send(wsData);
        }
    }

    playersTurn(currentPlayer!);

    const playerIntactShips = userShips!.ships
        .map((item) => {
            return item.position.map((position) => {
                return {
                    status: position.status,
                };
            });
        })
        .flat();

    if (playerIntactShips.every((item) => item.status === DeckStatus.HINT)) {
        updateWinners(currentPlayer, enemyPlayer);

        const wsData = getWsSendData(
            {
                winPlayer: currentPlayer!.index,
            },
            WebsocketTypes.FINISH,
        );

        currentPlayer.ws!.send(wsData);
        enemyPlayer.ws!.send(wsData);
    }
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
