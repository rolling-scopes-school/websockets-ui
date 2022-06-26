import { drawLine } from "./drawLine"
import robot from 'robotjs'

export const drawSquare = (width: number) => {
    drawLine(width, 'right')
    drawLine(width, 'down')
    drawLine(width, 'left')
    drawLine(width, 'up')
    robot.mouseToggle('up', 'left')
}
