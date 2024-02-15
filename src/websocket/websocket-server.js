import { WebSocketServer } from "ws";
import gameData from "./game-data.js";

const wss = new WebSocketServer({ port: 3000 });

console.log("WebSocket server started");

function sendMessage(ws, message) {
  ws.send(JSON.stringify(message));
}

wss.on("connection", function connection(ws) {
  console.log("New client connected");

  ws.on("message", function incoming(message) {
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

function handleIncomingMessage(ws, message) {
  switch (message.type) {
    case "reg":
      const regData = JSON.parse(message.data);
      handleRegistration(ws, regData);
      break;
    case "create_room":
      handleCreateRoom(ws, message.data);
      break;
    case "add_user_to_room":
      handleAddUserToRoom(ws, message.data);
      break;
    default:
      sendMessage(ws, { type: "error", message: "Unknown command" });
  }
}

function handleRegistration(ws, data) {
  const { name, password } = data;
  const player = { name, password };
  gameData.players.push(player);

  sendMessage(ws, {
    type: "reg",
    data: {
      name: name,
      index: gameData.players.length - 1,
      error: false,
      errorText: "",
    },
    id: 0,
  });
}

function handleCreateRoom(ws, data) {
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

function handleAddUserToRoom(ws, data) {
  const room = gameData.rooms.find((room) => room.id === data.indexRoom);
  if (room) {
    room.players.push({ ws, index: gameData.players.length });
    room.players.forEach((player) =>
      sendMessage(player.ws, {
        type: "update_room",
        data: [{ roomId: room.id, roomUsers: room.players }],
      })
    );
  }
}
