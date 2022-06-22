import robot from "robotjs";
import jimp from "jimp";

export function printScreen() {
//   // screenCaptureToFile("./test.png");
//   captureImage().write("./capture.png");
// }


// function captureImage() {
  const mousePos = robot.getMousePos();
  const screenCapture = robot.screen.capture(mousePos.x, mousePos.y, 200, 200);
  const width = screenCapture.byteWidth / screenCapture.bytesPerPixel;
  const height = screenCapture.height;
  const image = new jimp(width, height);
  let red: number, green: number, blue: number;
  screenCapture.image.forEach((byte: any, i: number) => {
    switch (i % 4) {
      case 0:
        return (blue = byte);
      case 1:
        return (green = byte);
      case 2:
        return (red = byte);
      case 3:
        image.bitmap.data[i - 3] = red;
        image.bitmap.data[i - 2] = green;
        image.bitmap.data[i - 1] = blue;
        image.bitmap.data[i] = 255;
    }
  });
  return image;
}

// var screenCaptureToFile = function (path: string) {
//   return new Promise((resolve, reject) => {
//     try {
//       let picture = robot.screen.capture();
//       let image = new jimp(picture.width, picture.height, function (err, img) {
//         img.bitmap.data = picture.image;
//         img.getBuffer(jimp.MIME_PNG, (err, png) => {
//           image.write(path, resolve);
//         });
//       });
//     } catch (e) {
//       console.error(e);
//       reject(e);
//     }
//   });
// };
