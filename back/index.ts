import { WebSocketServer } from "ws";
import robot from "robotjs";
import { handleMessages } from "./utils/handleMessages";
import { ActionsEnum } from "./utils/constants";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("Start websocket on the 8080 port");
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    const dataString = data.toString();
    
    // if (dataString === "mouse_position") {
    //   const mousePos = robot.getMousePos();
    //   ws.send(`${dataString}_${mousePos.x}_${mousePos.y}`);
    //   // ws.send('mouse_position_1_2');
    // } else {
      handleMessages(dataString, ws);
      // ws.send(dataString);
    }
  // }
  );
});
