import robot from "robotjs";
import Jimp from "jimp";

const IMG_SIZE = 200;
export async function printScreen() {
  const { x, y } = robot.getMousePos();
  try {
    const image = captureImage({
      x: Math.max(x - IMG_SIZE / 2, 0), // handling start of screen
      y: Math.max(y - IMG_SIZE / 2, 0),
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
  const { width: screenWidth, height: screenHeight } = robot.getScreenSize();

  const pic = robot.screen.capture(
    Math.min(x, screenWidth - w), // handling end of screen
    Math.min(y, screenHeight - h),
    w,
    h
  );

  const width = pic.byteWidth / pic.bytesPerPixel; // pic.width is sometimes wrong!
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
