import { mouse } from "@nut-tree/nut-js";

export async function getScreenShot() {
    const screenShotSize = 200;
    const half = screenShotSize / 2;
    const { x, y } = await mouse.getPosition();

    return {
        left: x - half,
        top: y - half,
        width: screenShotSize,
        height: screenShotSize,
    };
}