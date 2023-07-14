import { games, roomDB, UserData, userDB } from "../db.js";
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

const createRoom = (wss, userData) => {
  const id = roomDB.createRoom();
  roomDB.addUserToRoom(id, userData);
  updateRooms(wss);
}

const addUserToRoom = (wss, data, userData) => {
  roomDB.addUserToRoom(data.data.indexRoom, userData);
  updateRooms(wss);
}

const addShips = (data, userData: UserData) => {
  games[userData.gameIndex].addShips(data.data);
}

const attack = (data, userData: UserData) => {
  games[userData.gameIndex].attack(data.data);
}

const randomAttack = (data, userData: UserData) => {
  games[userData.gameIndex].randomAttack(data.data);
}

const singlePlay = (wss, userData: UserData) => {
  const id = roomDB.createRoom();
  roomDB.singleRoom(id, userData);
  updateRooms(wss);
}

const messageHandler = (wss, ws, rawData, userData) => {
  const data = JSON.parse(rawData);
  if (typeof data.data === 'string' && data.data !== '')
    data.data = JSON.parse(data.data);
  switch (data.type) {
    case 'reg':
      regPlayer(wss, ws, data, userData);
      break;
    case 'create_room':
      createRoom(wss, userData);
      break;
    case 'add_user_to_room':
      addUserToRoom(wss, data, userData);
      break;
    case 'add_ships':
      addShips(data, userData);
      break;
    case 'attack':
      attack(data, userData);
      break;
    case 'randomAttack':
      randomAttack(data, userData);
      break;
    case 'single_play':
      singlePlay(wss, userData);
      break;
  }
}

export { messageHandler }