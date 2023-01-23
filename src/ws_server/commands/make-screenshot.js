import { Region, screen } from '@nut-tree/nut-js';
import Jimp from "jimp";

export default async (startPosition, size) => {
  try {
    const region = new Region(startPosition.x, startPosition.y, size, size);

    await screen.highlight(region);

    const grabedRegion = await screen.grabRegion(region);
    const rgbImage = await grabedRegion.toRGB();
    const image = new Jimp(size, size);

    image.bitmap.data = rgbImage.data;
    image.bitmap.width = size;
    image.bitmap.height = size;

    const base64String = await image.getBase64Async(Jimp.MIME_PNG);

    return base64String.replace("data:image/png;base64,", "");
  } 
  catch {
    return undefined;
  }
}