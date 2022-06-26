import Jimp from 'jimp';
import robot from 'robotjs';
import { WebSocket } from 'ws';
import { createClietCommand } from '../utils';
import constants from '../constants';

const printScreen = async (
  ws: WebSocket,
  width: number = 200,
  height: number = 200
) => {
  const mousePos = robot.getMousePos();
  const img = robot.screen.capture(mousePos.x, mousePos.y, width, height).image;

  const screenShoot = await new Jimp({ data: img, width, height });
  const imageBase64 = await screenShoot.getBase64Async(Jimp.MIME_PNG);
  const screenshootPNGBuffer = imageBase64.split(',')[1];

  return ws.send(
    createClietCommand(`${constants.PRINT_SCREEN} ${screenshootPNGBuffer}`)
  );
};

export default printScreen;
