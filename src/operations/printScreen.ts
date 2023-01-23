import { mouse, Region, screen } from "@nut-tree/nut-js";
import Jimp from "jimp";

import { Operation, SCREENSHOT_SIZE } from "../constants";

export const getPrintScreen: Operation = async (operation: string): Promise<string> => {
  const { x, y } = await mouse.getPosition();

  const grabImage = await screen.grabRegion(
    new Region(
      Math.max(0, x - SCREENSHOT_SIZE / 2),
      Math.max(0, y - SCREENSHOT_SIZE / 2),
      SCREENSHOT_SIZE,
      SCREENSHOT_SIZE,
    ),
  );

  const { data, width, height } = await grabImage.toRGB();

  const jimp = new Jimp({
    data,
    width,
    height,
  });

  const buffer = await jimp.getBufferAsync(Jimp.MIME_PNG);

  return `${operation} ${buffer.toString("base64")}`;
};
