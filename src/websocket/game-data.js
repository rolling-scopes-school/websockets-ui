let rooms = [];
let players = [];
let gameStatus = {};

function addRoom(room) {
  rooms.push(room);
}

function removeRoom(roomId) {
  rooms = rooms.filter((room) => room.id !== roomId);
}

function addPlayer(player) {
  players.push(player);
}

export default {
  rooms,
  players,
  gameStatus,
  addRoom,
  removeRoom,
  addPlayer,
};
