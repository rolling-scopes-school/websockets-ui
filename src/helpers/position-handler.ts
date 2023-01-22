import { screen, mouse, Button } from "@nut-tree/nut-js";

export async function checkCoordinates(x, y) {
    const screenWidth = await screen.width();
    const screenHeight = await screen.height();

    if (x < 0 || y < 0 || x > screenWidth || y > screenHeight) {
        mouse.releaseButton(Button.LEFT);
        throw Error("Incorrect coordinates");
    }
}