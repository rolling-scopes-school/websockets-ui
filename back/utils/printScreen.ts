import robot from "robotjs";
import jimp from "jimp";
import { WebSocket } from "ws";

export function printScreen(ws: WebSocket) {
  const mousePos = robot.getMousePos();
  const screenCapture = robot.screen.capture(mousePos.x, mousePos.y, 200, 200);
  const width = screenCapture.byteWidth / screenCapture.bytesPerPixel;
  const height = screenCapture.height;
  const image = new jimp(width, height);
  let red: number, green: number, blue: number;
  screenCapture.image.forEach((byte: any, i: number) => {
    switch (i % 4) {
      case 0:
        return (blue = byte);
      case 1:
        return (green = byte);
      case 2:
        return (red = byte);
      case 3:
        image.bitmap.data[i - 3] = red;
        image.bitmap.data[i - 2] = green;
        image.bitmap.data[i - 1] = blue;
        image.bitmap.data[i] = 255;
    }
  });
  image.getBase64(jimp.MIME_PNG, function (err, base64) {
    base64 = base64.replace("data:image/png;base64,",'');
    ws.send(`prnt_scrn ${base64}`);
  });

}
