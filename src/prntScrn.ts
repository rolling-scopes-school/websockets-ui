import robot from 'robotjs';
import Jimp from 'jimp';

export const prntScrn = async (x: number, y: number) => {
  const widthSize = 200;
  const heightSize = 200;
  const img = robot.screen.capture(x - widthSize / 2, y - heightSize / 2, widthSize, heightSize);

  const jimp = new Jimp({ data: img.image, width: img.width, height: img.height });
  const base64Img = await jimp.getBase64Async(Jimp.MIME_PNG);
  const base64 = base64Img.split(',')[1];
  return base64;
};
