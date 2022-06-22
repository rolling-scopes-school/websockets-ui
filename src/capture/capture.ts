import { IMousePosition } from '../../interfaces';
import Jimp from 'jimp';
import { Bitmap } from 'robotjs';
import { COMMANDS, PRINT_SCREEN_IMAGE_SIZE } from '../../constants';

class Capture {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  private static transformImageColor(image: Bitmap): Bitmap {
    for (let i = 0; i < image.image.length; i++) {
      if (i % 4 == 0) {
        [image.image[i], image.image[i + 2]] = [image.image[i + 2], image.image[i]];
      }
    }

    return image;
  }

  private static transformToPNGBuffer(image: Bitmap): string {
    let base64: string;
    const jImg = new Jimp(image.width, image.height);
    jImg.bitmap.data = image.image;
    jImg.getBuffer(Jimp.MIME_PNG, (err: Error, result: Buffer) => {
      base64 = result.toString('base64');
    });

    return base64;
  }

  private getMousePosition(): IMousePosition {
    const mouse: IMousePosition = this.robot.getMousePos();

    return {
      x: mouse.x,
      y: mouse.y,
    };
  }

  getScreenCapture(): string {
    const position: IMousePosition = this.getMousePosition();
    const img: Bitmap = this.robot.screen.capture(
      position.x,
      position.y,
      PRINT_SCREEN_IMAGE_SIZE,
      PRINT_SCREEN_IMAGE_SIZE,
    );

    const transformImage = Capture.transformImageColor(img);
    const base64: string = Capture.transformToPNGBuffer(transformImage);

    return `${COMMANDS.PRINT_SCREEN} ${base64}`;
  }
}

export default Capture;
