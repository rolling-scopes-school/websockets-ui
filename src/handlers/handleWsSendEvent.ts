import WebSocket from 'ws';

const handleWsSendEvent = (ws: WebSocket, commandType: string, data: any) => {
  ws.send(
    JSON.stringify({
      type: commandType,
      data: JSON.stringify(data),
      id: 0,
    }),
  );
};

export default handleWsSendEvent;
