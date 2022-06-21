import { IMousePosition } from '../../interfaces';
import Jimp from 'jimp';
import { Bitmap } from 'robotjs';

class Capture {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  private getMousePosition(): IMousePosition {
    const mouse: IMousePosition = this.robot.getMousePos();

    return {
      x: mouse.x,
      y: mouse.y,
    };
  }

  //TODO PASS SIZE FROM SERVER PLUS REFACTOR
  getScreenCapture(): string {
    const size = 200;
    const position = this.getMousePosition();
    const img: Bitmap = this.robot.screen.capture(position.x, position.y, size, size);
    let base64: string;

    for (let i = 0; i < img.image.length; i++) {
      if (i % 4 == 0) {
        [img.image[i], img.image[i + 2]] = [img.image[i + 2], img.image[i]];
      }
    }

    const jImg = new Jimp(img.width, img.height);
    jImg.bitmap.data = img.image;
    jImg.getBuffer(Jimp.MIME_PNG, (err: Error, result: Buffer) => {
      base64 = result.toString('base64');
    });

    return base64;
  }
}

export default Capture;
