import {CommandHandler} from "../models/command-handler.type.js";
import {Button, down, left, mouse, Point, right, straightTo, up} from "@nut-tree/nut-js";

const CIRCLE_DRAW_STEP = 0.05;

const drawCircle: CommandHandler = async ([radius]) => {
    if (!radius) {
        throw new Error(`Incorrect radius`);
    }

    const normalizedRadius = parseInt(radius);

    const { x: xPos, y: yPos } = await mouse.getPosition();

    const circleCenterX = xPos + normalizedRadius;
    const circleCenterY = yPos;

    await mouse.pressButton(Button.LEFT);

    for (let i = 0; i <= 2 * Math.PI; i += CIRCLE_DRAW_STEP) {
        const x = circleCenterX - normalizedRadius * Math.cos(i);
        const y = circleCenterY - normalizedRadius * Math.sin(i);

        await mouse.move(straightTo(new Point(x, y)));
    }

    await mouse.releaseButton(Button.LEFT);

    return `success draw_circle ${radius}`;
};

export const drawSquare: CommandHandler = async ([sideWidth]) => {
    if (!sideWidth) {
        throw new Error(`Incorrect square side width`);
    }

    const normalizedSideWidth = parseInt(sideWidth);

    await mouse.pressButton(Button.LEFT);

    await mouse.move(right(normalizedSideWidth));
    await mouse.move(down(normalizedSideWidth));
    await mouse.move(left(normalizedSideWidth));
    await mouse.move(up(normalizedSideWidth));

    await mouse.releaseButton(Button.LEFT);

    return `success draw_square ${sideWidth}`;
}

export default {
    drawCircle,
    drawSquare
}
