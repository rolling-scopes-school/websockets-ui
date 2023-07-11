import { sendHandler } from "./sender";

const regPlayer = (ws, data) => {
  console.log('data', data);
  const res = data;
  res.data.index = 0;
  res.data.error = false;
  res.data.errorText = '';
  console.log('res', res);
  sendHandler(ws, res);
}

const messageHandler = (ws, rawData) => {
  console.log(rawData);
  const data = JSON.parse(rawData);
  if (typeof data.data === 'string' && data.data !== '')
    data.data = JSON.parse(data.data);
  switch (data.type) {
    case 'reg':
      regPlayer(ws, data);
      break;
  }
}

export { messageHandler }