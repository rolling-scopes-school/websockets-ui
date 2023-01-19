import { httpServer } from "./http_server/index";
import {
  mouse,
  left,
  right,
  up,
  down,
  Button,
  Point,
	straightTo,
	screen,
	Region
} from "@nut-tree/nut-js";
import * as WebSocket from "ws";
import { EOL } from "os";
import Jimp from "jimp";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocket.WebSocketServer({ port: 3000 });

wss.on("headers", (headers, request) => {
  const firstPart = `${headers[2]}!${EOL}`;
  const secondPart = `${request.rawHeaders[0]}: ${request.rawHeaders[1]} with front: ${request.rawHeaders[13]}`;
  console.log(`${firstPart}Websocket has been started on ${secondPart}`);
});

wss.on("connection", (ws: WebSocket.WebSocket) => {
  const wsStrem = WebSocket.createWebSocketStream(ws, {
    encoding: "utf-8",
    decodeStrings: false,
  });
  wsStrem.on("data", async (chunk) => {
    const dataParse = chunk.toString().split(" ");

    const [command, ...args] = dataParse;
    console.log(chunk.toString());
    if (command !== "mouse_position" && command !== "prnt_scrn") {
      wsStrem.write(`${chunk.toString()}`);
    }
    switch (command) {
      case "mouse_up":
        mouse.move(up(Number(args)));
        return;
      case "mouse_down":
        mouse.move(down(Number(args)));
        return;
      case "mouse_right":
        mouse.move(right(Number(args)));
        return;
      case "mouse_left":
        mouse.move(left(Number(args)));
        return;
      case "mouse_position":
        const position = await mouse.getPosition();
        wsStrem.write(`mouse_position ${position.x},${position.y}`);
        console.log(`mouse_position ${position.x},${position.y}`);
        return;
      case "draw_square":
        const px = Number(args[0]);
        await square(px);
        return;
      case "draw_circle":
        const rad = Number(args[0]);
        await drawCircle(rad);
        return;
      case "draw_rectangle":
        const width = Number(args[0]);
        const length = Number(args[1]);
        await drawRectangle(width, length);
			 return;
			 case "prnt_scrn":
			 const img = await printScreen()
			 wsStrem.write(`prnt_scrn ${img}`);
				return;
    }
  });
});

export const square = async (px: number) => {
  await mouse.leftClick();
  await mouse.pressButton(Button.LEFT);
  await mouse.move(right(px));
  await mouse.move(down(px));
  await mouse.move(left(px));
  await mouse.move(up(px));
  await mouse.releaseButton(Button.LEFT);
  return console.log("square has been drawed");
};

const drawRectangle = async (width: number, length: number) => {
  await mouse.leftClick();
  await mouse.pressButton(Button.LEFT);
  await mouse.move(right(length));
  await mouse.move(down(width));
  await mouse.move(left(length));
  await mouse.move(up(width));
  await mouse.releaseButton(Button.LEFT);
  return console.log("Rectangle has been drawed");
};

const drawCircle = async (radius: number) => {
  await mouse.leftClick();
  await mouse.pressButton(Button.LEFT);
  const mousePos = await mouse.getPosition();
  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const x = mousePos.x - radius + radius * Math.cos(i);
    const y = mousePos.y + radius * Math.sin(i);
    const target = new Point(x, y);
    await mouse.move(straightTo(target));
  }
  await mouse.releaseButton(Button.LEFT);
  console.log("Circle has been drawed");
  return { radius };
};

const printScreen = async () => {
	const mousePos = await mouse.getPosition();
	const left = (mousePos.x - 100)
	const top = (mousePos.y - 100)
	const imageBgr = await screen.grabRegion(
		new Region(
			left,
			top,
			 200,
			 200,
		),
	);

	for (let i = 0; i < imageBgr.data.length; i += 4) {
		if (i % 4 === 0) {
		  [imageBgr.data[i], imageBgr.data[i + 2]] = [imageBgr.data[i + 2], imageBgr.data[i]];
		}
	 }
  
	 const imageJimp = new Jimp({ data: imageBgr.data, width: imageBgr.width, height: imageBgr.height }, (err: any, image: any) => {
		if (err) throw err;
		return image;
	 });
	 const parse = await imageJimp.getBase64Async(Jimp.MIME_PNG);
	 return parse.split(',')[1];

}
