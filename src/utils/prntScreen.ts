import Jimp from 'jimp'; 
import { screen } from 'robotjs';

import { Coordinates } from "../types";

const DEFAULT_SIZE = 200;

const prntScreen = async ({x, y}: Coordinates) => {
  const capture = screen.capture(x, y, DEFAULT_SIZE, DEFAULT_SIZE);
  const jimp = new Jimp({
    data: capture.image,
    width: capture.width,
    height: capture.height,
  })
  
  const base64Image = await jimp.getBase64Async(Jimp.MIME_PNG);
  const base64 = base64Image.split(',')[1];

  return base64;
}

export default prntScreen;
