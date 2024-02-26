import { WebSocket } from 'ws';

import { WebsocketTypes } from '../../enum/websocket.types';
import { localWinnersBase } from '../../local_data_base/local.winners.base';
import { updateRoom } from '../rooms/room.module';
import { User } from './user';
import { localDataBase } from '../../local_data_base/local.data.base';
import { UserInterface } from '../../interface/user.interface';
import { ReceivedDataInterface } from '../../interface/received.data.interface';
import { getWsSendData } from '../../utils/stringify.data';
import { sendDataForRealPlayer } from '../game/game.module';

let userIndex = 1;

export const storeUserData = (
    ws: WebSocket,
    receivedData: ReceivedDataInterface,
    currentUser: User,
) => {
    const { data } = receivedData;
    const { name, password } = JSON.parse(data);

    const isPlayerExist = localDataBase.find((user) => user.name === name);

    if (isPlayerExist) {
        const wsData = getWsSendData(
            {
                name,
                index: userIndex,
                error: true,
                errorText: 'User with the same name already exists',
            },
            WebsocketTypes.REG,
        );
        ws.send(wsData);
    }

    if (!isPlayerExist) {
        const wsData = getWsSendData(
            {
                name,
                index: userIndex,
                error: false,
                errorText: '',
            },
            WebsocketTypes.REG,
        );

        ws.send(wsData);

        const user: UserInterface = {
            name,
            password,
            wins: 0,
            index: userIndex,
            ws,
        };

        currentUser.setCurrentPlayer(user);

        localDataBase.push(user);

        userIndex += 1;

        updateRoom(ws, currentUser);
        updateWinners(currentUser.getCurrentPlayer());
    }
};

export const updateWinners = (
    currentUser: UserInterface,
    enemyPlayer?: UserInterface,
) => {
    const isSingleGame = currentUser.playWithBot || enemyPlayer?.playWithBot;

    if (enemyPlayer && !isSingleGame) {
        const playerWinsIndexData = localWinnersBase.findIndex(
            (item) => item.name === currentUser.name,
        );

        if (playerWinsIndexData === -1) {
            localWinnersBase.push({
                name: currentUser.name,
                wins: 1,
            });
        } else {
            const playerWinData = {
                name: localWinnersBase[playerWinsIndexData]!.name,
                wins: localWinnersBase[playerWinsIndexData]!.wins + 1,
            };
            delete localWinnersBase[playerWinsIndexData];
            localWinnersBase[playerWinsIndexData] = playerWinData;
        }
    }

    let wsData = getWsSendData(localWinnersBase, WebsocketTypes.UPDATE_WINNERS);

    if (isSingleGame) {
        const { wins, name } = localWinnersBase[0]!;

        const updateBotData = {
            wins: wins + 1,
            name,
        };

        delete localWinnersBase[0];
        localWinnersBase[0] = updateBotData;

        wsData = getWsSendData(localWinnersBase, WebsocketTypes.UPDATE_WINNERS);

        sendDataForRealPlayer(currentUser, wsData, enemyPlayer);
    } else {
        currentUser!.ws!.send(wsData);

        if (enemyPlayer?.ws) {
            enemyPlayer.ws!.send(wsData);
        }
    }
};
