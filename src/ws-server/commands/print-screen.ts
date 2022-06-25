import robot from "robotjs";
import Jimp from "jimp";

const IMG_SIZE = 200;
export async function printScreen() {
  const { x: xPos, y: yPos } = robot.getMousePos();
  const { width: screenWidth, height: screenHeight } = robot.getScreenSize();

  // centering and handling going out of start bounds of screen
  const centeredX = Math.max(xPos - IMG_SIZE / 2, 0);
  const centeredY = Math.max(yPos - IMG_SIZE / 2, 0);

  // handling going out of end bounds of screen
  const x = Math.min(centeredX, screenWidth - IMG_SIZE);
  const y = Math.min(centeredY, screenHeight - IMG_SIZE);

  try {
    const image = captureImage({
      x,
      y,
      w: IMG_SIZE,
      h: IMG_SIZE,
    });

    const imageBase64 = await image.getBase64Async(Jimp.MIME_PNG);
    return ` ${(imageBase64 as string).replace("data:image/png;base64,", "")}`;
  } catch (error) {
    return error;
  }
}

function captureImage({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const pic = robot.screen.capture(x, y, w, h);

  const width = pic.byteWidth / pic.bytesPerPixel;
  const height = pic.height;
  const image = new Jimp(width, height);

  // BGR -> RGB
  let red: number, green: number, blue: number;
  pic.image.forEach((byte: number, i: number) => {
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
  return image;
}
