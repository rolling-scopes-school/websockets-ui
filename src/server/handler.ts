import { roomDB, userDB } from "../db.js";
import { updateRooms, updateWinners } from "./broadcast.js";
import { sendHandler } from "./sender.js";

const regPlayer = (wss, ws, data, userData) => {
  const res = data;
  res.data = userDB.createUser(data.data.name, data.data.password);
  if (!res.error) {
    userData.name = res.data.name;
    userData.index = res.data.index;
  }
  sendHandler(wss, ws, res);
  updateRooms(wss);
  updateWinners(wss);
}

const createRoom = (wss, ws, data, userData) => {
  console.log('want to create room');
  const id = roomDB.createRoom();
  roomDB.addUserToRoom(id, userData);
  updateRooms(wss);
}

const addUserToRoom = (wss, ws, data, userData) => {
  roomDB.addUserToRoom(data.data.indexRoom, userData);
  updateRooms(wss);
}

const messageHandler = (wss, ws, rawData, userData) => {
  console.log(rawData);
  const data = JSON.parse(rawData);
  if (typeof data.data === 'string' && data.data !== '')
    data.data = JSON.parse(data.data);
  switch (data.type) {
    case 'reg':
      regPlayer(wss, ws, data, userData);
      break;
    case 'create_room':
      createRoom(wss, ws, data, userData);
      break;
    case 'add_user_to_room':
      addUserToRoom(wss, ws, data, userData);
      break;
  }
}

export { messageHandler }