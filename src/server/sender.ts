const sendHandler = (wss, ws, data) => {
  data.data = JSON.stringify(data.data);
  ws.send(JSON.stringify(data));
}

export { sendHandler };