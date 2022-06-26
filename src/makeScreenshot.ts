import robot from 'robotjs';
import Jimp from 'jimp';
import WebSocket from 'ws';

export const makeScreenshot = async (ws: WebSocket) => {
  const { x, y } = robot.getMousePos();

  const bitmap = robot.screen.capture(x, y, 200, 200);

  const image = new Jimp({
    data: bitmap.image,
    width: bitmap.width,
    height: bitmap.height,
  });

  const response = await image.getBase64Async(Jimp.MIME_PNG);

  ws.send(`prnt_scrn ${response.split(';base64,')[1]}`);
};
