import {CommandHandler} from "../models/command-handler.type.js";
import {Button, mouse, Point, straightTo} from "@nut-tree/nut-js";

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

export default {
    drawCircle
}
