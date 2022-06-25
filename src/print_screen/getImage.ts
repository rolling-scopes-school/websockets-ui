import robot from 'robotjs';
import jimp from 'jimp';
import { crop } from '../utils/utils';

export const getImage = (
  duplex: any
) => {
  const mouse = robot.getMousePos();
  const robotScreenPic = robot.screen.capture(mouse.x, mouse.y, 200, 200);
  return new Promise(async (resolve: any, reject) => {
    try {
      const image = new jimp(robotScreenPic.width, robotScreenPic.height);
      let pos = 0;
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
      });
      let base64: string | string[] = await image.getBase64Async(jimp.MIME_PNG);

      duplex.write(`prnt_scrn ${crop(base64)}`);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};