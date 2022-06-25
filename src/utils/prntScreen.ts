import Jimp from 'jimp'; 
import { screen } from 'robotjs';

import { Coordinates } from "../types";

const DEFAULT_SIZE = 200;

const prntScreen = async ({x, y}: Coordinates) => {
  const capture = screen.capture(x - (DEFAULT_SIZE / 3), y + (DEFAULT_SIZE / 4), DEFAULT_SIZE, DEFAULT_SIZE);
  const jimp = new Jimp({
    data: capture.image,
    width: capture.width,
    height: capture.height,
  })

  jimp.scan(0, 0, jimp.bitmap.width, jimp.bitmap.height, function (x, y, idx) {
    var color = capture.colorAt(x, y);
    var red = parseInt(color[0] + color[1], 16);
    var green = parseInt(color[2] + color[3], 16);
    var blue = parseInt(color[4] + color[5], 16);

    jimp.bitmap.data[idx + 0] = Number(red);
    jimp.bitmap.data[idx + 1] = Number(green);
    jimp.bitmap.data[idx + 2] = Number(blue);
    jimp.bitmap.data[idx + 3] = 255;
});
  
  const base64Image = await jimp.getBase64Async(Jimp.MIME_PNG);
  const base64 = base64Image.split(',')[1];

  return base64;
}

export default prntScreen;
