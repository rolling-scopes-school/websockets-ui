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
    IShipsShortInterface,
} from '../../interface/user.ships.interface';
import { ShipsTypes } from '../../enum/ships.types';
import { DeckStatus } from '../../enum/deck.status';
import { updateUserShips } from '../ships/ships';
import { updateWinners } from '../users/user.module';
import { getWsSendData } from '../../utils/stringify.data';
import { listOfPlayersTurn } from '../../local_data_base/local.list.of.players.turn';
import { IPlayerInterface } from '../../interface/list.of.players.turn.interface';
import { botTactics, removeBotHits, updateBotHits } from './bot.tactics';

export const playersTurn = (
    currentUser: UserInterface,
    enemyPlayer: UserInterface,
    gameId: number,
) => {
    const activePlayersTurnIndex = listOfPlayersTurn.findIndex(
        (item) => item.gameId === gameId,
    );

    if (activePlayersTurnIndex === -1) {
        const playerTurn = createPlayerListTurn();
        listOfPlayersTurn.push({
            gameId,
            indexPlayer: currentUser.index,
            [currentUser.index]: {
                indexPlayer: currentUser.index,
                playerTurns: playerTurn,
            },
            [enemyPlayer.index]: {
                indexPlayer: enemyPlayer.index,
                playerTurns: playerTurn,
            },
        });
    } else {
        const currentPlayerTurn = {
            ...listOfPlayersTurn[activePlayersTurnIndex]!,
            gameId,
            indexPlayer: currentUser.index,
        };
        delete listOfPlayersTurn[activePlayersTurnIndex];
        listOfPlayersTurn[activePlayersTurnIndex] = currentPlayerTurn;
    }

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

    const isCurrentPlayerTurn = checkUserTurn(indexPlayer, gameId);

    if (!isCurrentPlayerTurn) {
        return;
    }

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

    removeCurrentAttackCoordinates(gameId, indexPlayer, { x, y });

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

    if (currentPlayer?.playWithBot) {
        return botTurn(gameId, currentPlayer!, enemyPlayer!, ShipStatuses.MISS);
    }

    if (!currentPlayer?.playWithBot) {
        enemyPlayer!.ws?.send(wsData);
    }

    playersTurn(enemyPlayer!, currentPlayer!, gameId);
};
const getHitData = (
    ship: IShipsFullInterface[],
    data: IAttackData,
    enemyPlayer: UserInterface,
    currentPlayer: UserInterface,
) => {
    const isSingleGame = currentPlayer.playWithBot || enemyPlayer.playWithBot;
    const shipType = ship[0]!.type;
    const { x, y, gameId } = data;

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

        if (isSingleGame) {
            sendDataForRealPlayer(currentPlayer, wsData, enemyPlayer);
        } else {
            currentPlayer.ws!.send(wsData);
            enemyPlayer.ws!.send(wsData);
        }

        const borderCoordinates = addingBorderAroundShip(
            ship,
            gameId,
            currentPlayer.index,
        );

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

            if (isSingleGame) {
                sendDataForRealPlayer(currentPlayer, wsData, enemyPlayer);
            } else {
                currentPlayer.ws!.send(wsData);
                enemyPlayer.ws!.send(wsData);
            }
        }

        if (isSingleGame && currentPlayer.index < 0) {
            updateBotHits(borderCoordinates, gameId);
        }

        if (!currentPlayer.playWithBot) {
            updateUserShips(enemyPlayer, ship, { x, y });
        }

        const userShips = localUserShips.find(
            (item) => item.indexPlayer === enemyPlayer?.index,
        );

        const playerIntactShips = userShips!.ships
            .map((item) => {
                return item.position.map((position) => {
                    return {
                        status: position.status,
                    };
                });
            })
            .flat();

        if (
            playerIntactShips.every((item) => item.status === DeckStatus.HINT)
        ) {
            updateWinners(currentPlayer, enemyPlayer);

            const wsData = getWsSendData(
                {
                    winPlayer: currentPlayer!.index,
                },
                WebsocketTypes.FINISH,
            );

            if (isSingleGame) {
                sendDataForRealPlayer(currentPlayer, wsData, enemyPlayer);
            } else {
                currentPlayer.ws!.send(wsData);
                enemyPlayer.ws!.send(wsData);
            }
        }

        if (currentPlayer.index < 0) {
            return botTurn(
                gameId,
                enemyPlayer!,
                currentPlayer!,
                ShipStatuses.KILLED,
            );
        }

        return playersTurn(currentPlayer!, enemyPlayer, gameId);
    }

    checkShipDecks(ship, enemyPlayer, currentPlayer, { x, y }, gameId);
};

const addingBorderAroundShip = (
    ship: IShipsFullInterface[],
    gameId: number,
    indexPlayer: number,
) => {
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

    arrWithBorderCoordinates.forEach((item) => {
        removeCurrentAttackCoordinates(gameId, indexPlayer, item);
    });

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
    gameId: number,
) => {
    const isSingleGame = currentPlayer.playWithBot || enemyPlayer.playWithBot;
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

    if (isSingleGame) {
        sendDataForRealPlayer(currentPlayer, wsData, enemyPlayer);
    } else {
        currentPlayer.ws!.send(wsData);
        enemyPlayer.ws!.send(wsData);
    }

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

            if (isSingleGame) {
                sendDataForRealPlayer(currentPlayer, wsData, enemyPlayer);
            } else {
                currentPlayer.ws!.send(wsData);
                enemyPlayer.ws!.send(wsData);
            }
        }

        const borderCoordinates = addingBorderAroundShip(
            currentShip,
            gameId,
            currentPlayer.index,
        );

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

            if (isSingleGame) {
                sendDataForRealPlayer(currentPlayer, wsData, enemyPlayer);
            } else {
                currentPlayer.ws!.send(wsData);
                enemyPlayer.ws!.send(wsData);
            }
        }

        if (isSingleGame && currentPlayer.index < 0) {
            removeBotHits(gameId);
            updateBotHits(borderCoordinates, gameId);
        }
    }
    const status = !isShipIntact ? ShipStatuses.KILLED : ShipStatuses.SHOT;

    if (currentPlayer.index < 0) {
        botTurn(gameId, enemyPlayer!, currentPlayer!, status, attackPosition);
    } else {
        playersTurn(currentPlayer!, enemyPlayer!, gameId);
    }
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

        if (isSingleGame) {
            sendDataForRealPlayer(currentPlayer, wsData, enemyPlayer);
        } else {
            currentPlayer.ws!.send(wsData);
            enemyPlayer.ws!.send(wsData);
        }
    }
};

const checkUserTurn = (indexPlayer: number, gameId: number): boolean => {
    const currentUserTurn = listOfPlayersTurn.find(
        (gameSession) => gameSession.gameId === gameId,
    );

    if (currentUserTurn?.indexPlayer !== indexPlayer) {
        return false;
    }
    return true;
};

export const randomAttack = (ws: WebSocket, receivedData: any) => {
    const { data } = receivedData;
    const { gameId, indexPlayer } = JSON.parse(data);

    const currentUser = localDataBase.find(
        (users) => users.index === indexPlayer,
    );

    const activeSessionTurns = listOfPlayersTurn.find(
        (session) => session.gameId === gameId,
    )!;

    const { playerTurns } = activeSessionTurns[
        currentUser!.index!
    ] as IPlayerInterface;

    const coordinate = getRandomCoordinate(playerTurns);
    const attackData = {
        type: WebsocketTypes.ATTACK,
        data: JSON.stringify({
            gameId,
            x: coordinate!.x,
            y: coordinate!.y,
            indexPlayer: currentUser?.index,
        }),
        id: 0,
    };
    playerAttack(ws, attackData);
};

const createPlayerListTurn = () => {
    const listOfPlayerTurns = [];

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            listOfPlayerTurns.push({ x: i, y: j });
        }
    }
    return listOfPlayerTurns;
};

const getRandomCoordinate = (coordinates: IPositionInterface[]) => {
    const index = Math.floor(Math.random() * (coordinates.length - 0)) + 0;
    return coordinates[index];
};

const removeCurrentAttackCoordinates = (
    gameId: number,
    indexPlayer: number,
    coordinates: IPositionInterface,
) => {
    const currentSessionIndex = listOfPlayersTurn.findIndex(
        (session) => session.gameId === gameId,
    );

    const { playerTurns } = listOfPlayersTurn[currentSessionIndex]![
        indexPlayer
    ] as IPlayerInterface;

    const coordinatesSet = new Set(
        [coordinates].map((item) => JSON.stringify(item)),
    );

    const playerTurnsWithoutThisTurn = playerTurns.filter(
        (item) => !coordinatesSet.has(JSON.stringify(item)),
    );

    const sessionPlayersTurnData = {
        ...listOfPlayersTurn[currentSessionIndex],
        indexPlayer: listOfPlayersTurn[currentSessionIndex]!.indexPlayer,
        gameId: listOfPlayersTurn[currentSessionIndex]!.gameId,
        [indexPlayer]: {
            indexPlayer,
            playerTurns: playerTurnsWithoutThisTurn,
        },
    };

    delete listOfPlayersTurn[currentSessionIndex];
    listOfPlayersTurn[currentSessionIndex] = sessionPlayersTurnData;
};

export const startSingleGame = (
    ws: WebSocket,
    player: UserInterface,
    botPlayer: UserInterface,
    ships: IShipsShortInterface[],
    gameId: number,
) => {
    const wsData = getWsSendData(
        {
            ships,
            indexPlayer: player.index,
        },
        WebsocketTypes.START_GAME,
    );

    ws.send(wsData);

    playersTurn(player, botPlayer, gameId);
};

export const botTurn = (
    gameId: number,
    currentUser: UserInterface,
    enemyPlayer: UserInterface,
    status: ShipStatuses,
    attackPosition?: IPositionInterface,
) => {
    playersTurn(enemyPlayer, currentUser, gameId);
    botTactics(gameId, currentUser, enemyPlayer, status, attackPosition);
};
export const sendDataForRealPlayer = (
    currentUser: UserInterface,
    wsData: string,
    enemyPlayer?: UserInterface,
) => {
    const currentUserIndex = currentUser.index;
    const enemyPlayerIndex = enemyPlayer?.index;

    if (currentUserIndex >= 0) {
        currentUser.ws!.send(wsData);
    }

    if (enemyPlayerIndex && enemyPlayerIndex >= 0) {
        enemyPlayer.ws!.send(wsData);
    }
};
