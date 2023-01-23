import { screen, Region, Point } from '@nut-tree/nut-js';
import Jimp from 'jimp';
import { PRNT_SCRN_SIZE } from '../../const';

export class PrntScrnService {
  static async getPrntScrnBase64(mousePosition: Point): Promise<string> {
    const prntScrnHalfSize = PRNT_SCRN_SIZE / 2;
    const region = await screen.grabRegion(
      new Region(
        mousePosition.x - prntScrnHalfSize,
        mousePosition.y - prntScrnHalfSize,
        PRNT_SCRN_SIZE,
        PRNT_SCRN_SIZE
      )
    );
    const { data, width, height } = await region.toRGB();
    const image = new Jimp({
      data,
      width,
      height
    });
    const base64 = (await image.getBufferAsync(Jimp.MIME_PNG)).toString(
      'base64'
    );
    return base64;
  }
}
