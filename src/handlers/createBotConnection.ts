import WebSocket from 'ws';
import { WS_ADDRESS } from '../../constants';

const createBotConnection = () => {
  const botWs = new WebSocket(WS_ADDRESS);

  botWs.on('open', () => {
    console.log('Bot connected to server');
  });

  botWs.on('close', () => {
    console.log('Disconnected from server');
  });

  return botWs;
};

export default createBotConnection;
