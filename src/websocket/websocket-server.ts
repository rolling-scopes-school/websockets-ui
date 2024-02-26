import { WebSocketServer } from "ws";
import * as gameData from "./game-data.js";

let playerID = 1;

const wss = new WebSocketServer({ port: 3000 });

console.log("WebSocket server started");

function sendMessage(ws: any, message: any) {
  ws.send(message);
}

wss.on("connection", function connection(ws: any) {
  console.log("New client connected");
  ws.id = playerID++;
  ws.on("error", console.error);

  ws.on("message", function incoming(message: string) {
    console.log("received: %s", message);
    try {
      const jsonMessage = JSON.parse(message);
      console.log(jsonMessage);
      handleIncomingMessage(ws, jsonMessage);
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    }
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
    handlePlayerDisconnect(ws);
  });
});

function handleIncomingMessage(ws: any, message: any) {
  switch (message.type) {
    case "reg":
      const regData = JSON.parse(message.data);
      handleRegistration(ws, regData);
      break;
    case "create_room":
      handleCreateRoom(ws, message.data);
      break;
    // case "add_user_to_room":
    //   handleAddUserToRoom(ws, message.data);
    //   break;
    default:
      sendMessage(ws, { type: "error", message: "Unknown command" });
  }
}

function handleRegistration(ws: any, data: any) {
  const { name, password } = data;
  const player = { name, password };
  gameData.players.push(player);
  const dataUser = JSON.stringify({
    name: name,
    index: 1,
    error: false,
    errorText: '',
  })
  const responseData =  JSON.stringify({
    type: 'reg',
    data: dataUser,
    id: 0,
  })
  sendMessage(ws,responseData);
}

function handleCreateRoom(ws: any, data: any) {
  const room = {
    id: gameData.rooms.length + 1,
    players: [{ ws, index: data.index }],
  };
  gameData.rooms.push(room);

  sendMessage(ws, {
    type: "create_game",
    data: { idGame: room.id, idPlayer: data.index },
  });
}

// function handleAddUserToRoom(ws: any, data: any) {
//   const room = gameData.rooms.find((room) => room.id === data.indexRoom);
//   if (room) {
//     room.players.push({ ws, index: gameData.players.length });
//     room.players.forEach((player) =>
//       sendMessage(player.ws, {
//         type: "update_room",
//         data: [{ roomId: room.id, roomUsers: room.players }],
//       })
//     );
//   }
// }

function handlePlayerDisconnect(ws: any) {
  // Your logic for handling player disconnect
}
