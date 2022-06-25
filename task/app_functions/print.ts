import Jimp from "jimp";
import robot from "robotjs";

const PrintScreen = function() {
  let pos = robot.getMousePos();
  let bitmap = robot.screen.capture(pos.x - 100, pos.y - 100, 200, 200).image;

  return new Promise((res) => {
    new Jimp(
      { data: bitmap, width: 200, height: 200 },
      (err: any, image: any) => {
        image.getBuffer(Jimp.MIME_PNG, (err: any, buffer: any) => {
          res(buffer.toString("base64"));
        });
      }
    );
  });
}

export default PrintScreen;