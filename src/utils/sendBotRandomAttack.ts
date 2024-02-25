import { handleWsSendEvent } from 'handlers';
import { BOT_ID, WS_COMMAND_TYPES } from '../../constants';
import { WebSocket } from 'ws';

const sendBotRandomAttack = (
  shooterId: string,
  gameId: string,
  isGameFinished: boolean,
  botWebsocket: WebSocket,
) => {
  if (shooterId === BOT_ID && !isGameFinished) {
    const data = {
      gameId,
      indexPlayer: shooterId,
    };

    setTimeout(
      () =>
        handleWsSendEvent(botWebsocket, WS_COMMAND_TYPES.RANDOM_ATTACK, data),
      2000,
    );
  }
};

export default sendBotRandomAttack;
