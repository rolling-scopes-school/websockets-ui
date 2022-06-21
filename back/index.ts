import { WebSocketServer } from "ws";
// import Jimp from 'jimp';
import robot from "robotjs";
const wss = new WebSocketServer({ port: 8080 });

robot.setMouseDelay(2);

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    const curData = data.toString();
    console.log(curData);
    const coord = parseData(data.toString());

    var mouse = robot.getMousePos();

    console.log(mouse.x, coord.x, mouse.y, coord.y);

    robot.moveMouse(mouse.x + coord.x, mouse.y + coord.y);
  });
  // setInterval(() => ws.send("something"), 2000);

  // robot.setMouseDelay(2);

  // var twoPI = Math.PI * 2.0;
  // var screenSize = robot.getScreenSize();
  // var height = screenSize.height / 2 - 10;
  // var width = screenSize.width;

  // for (var x = 0; x < width; x++) {
  //   const y = height * Math.sin((twoPI * x) / width) + height;
  //   robot.moveMouse(x, y);
  // }
});

function parseData(data: string) {
  const arrData = data.split(" ");
  const command = arrData[0];
  const size = Number(arrData[1]);
  const coordinates = { x: 0, y: 0 };
  switch (command) {
    case "mouse_left":
      coordinates.x = -size;
      break;

    case "mouse_right":
      coordinates.x = size;
      break;

    case "mouse_up":
      coordinates.y = -size;
      break;

    case "mouse_down":
      coordinates.y = size;
      break;

    // case value:
    //   break;

    // case value:
    //   break;

    // case value:
    //   break;

    default:
      break;
  }
  return coordinates;
}
