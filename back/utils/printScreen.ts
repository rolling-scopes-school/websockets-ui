import robot from "robotjs";
import jimp from "jimp";
import { ActionsEnum } from "./constants";

export function printScreen() {
  screenCaptureToFile("./test.png");
}

var screenCaptureToFile = function (path: string) {
  return new Promise((resolve, reject) => {
    try {
      var picture = robot.screen.capture();
      var image = new jimp(picture.width, picture.height, function (err, img) {
        img.bitmap.data = picture.image;
        img.getBuffer(jimp.MIME_PNG, (err, png) => {
          image.write(path, resolve);
        });
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};
