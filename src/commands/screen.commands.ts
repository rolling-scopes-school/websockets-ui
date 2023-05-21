import { mouse, Region, screen } from '@nut-tree/nut-js';
import Jimp from 'jimp';
import { Duplex } from 'stream';
import {CommandHandler} from "../models/command-handler.type.js";

const SCREENSHOT_SIZE = 200;

const getLeftAndTop = async () => {
    const { x: currentX, y: currentY } = await mouse.getPosition();

    const screenWidth = await screen.width();
    const screenHeight = await screen.height();

    let leftPoint = currentX - SCREENSHOT_SIZE;
    let topPoint = currentY - SCREENSHOT_SIZE;

    if (leftPoint < 0) leftPoint = 0;
    if (topPoint < 0) topPoint = 0;

    const isRegionLeftOutScreen =  leftPoint + SCREENSHOT_SIZE > screenWidth
    const isRegionTopOutScreen = topPoint + SCREENSHOT_SIZE > screenHeight;

    if (isRegionLeftOutScreen) leftPoint = screenWidth - SCREENSHOT_SIZE;

    if (isRegionTopOutScreen) topPoint = screenHeight - SCREENSHOT_SIZE;

    return { leftPoint, topPoint };
};

const makeScreenshot: CommandHandler = async (_: string[], webSocketStream: Duplex): Promise<string> => {
    const { leftPoint, topPoint } = await getLeftAndTop();

    const region = new Region(
        leftPoint,
        topPoint,
        SCREENSHOT_SIZE,
        SCREENSHOT_SIZE,
    );

    await screen.highlight(region);

    const imageBgr = await screen.grabRegion(region);

    const imageRgb = await imageBgr.toRGB();

    const jimpImage = new Jimp({
        data: imageRgb.data,
        width: imageRgb.width,
        height: imageRgb.height,
    });

    const base64buffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);
    const base64 = base64buffer.toString('base64');

    webSocketStream.write(`prnt_scrn ${base64}`);

    return `success prnt_scrn ${base64}`;
};

export { makeScreenshot };
