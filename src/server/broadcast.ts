import { WebSocketServer } from "ws";
import { roomDB, userDB } from "../db.js"

const updateRooms = (wss) => {
  const rooms = roomDB.getDB();
  const data = [];
  rooms.forEach(room => {
    if (room.roomUsers.length === 1)
      data.push(room);
  })
  const table = {
    type: "update_room",
    data: JSON.stringify(data),
    id: 0
  }
  wss.clients.forEach((ws) => {
    ws.send(JSON.stringify(table));
  })
}

const updateWinners = (wss: WebSocketServer) => {
  const users = userDB.getDB();
  const data = [];
  users.forEach(user => {
    data.push({
      name: user.name,
      wins: user.wins
    })
  })
  const table = {
    type: "update_winners",
    data: JSON.stringify(data),
    id: 0
  }
  wss.clients.forEach((ws) => {
    ws.send(JSON.stringify(table));
  })
}

export { updateRooms, updateWinners }