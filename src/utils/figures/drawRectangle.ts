import { drawLine } from "./drawLine"
import robot from 'robotjs'

export const drawRectangle = (width: number, length: number) => {
    drawLine(width, 'right')
    drawLine(length, 'down')
    drawLine(width, 'left')
    drawLine(length, 'up')
    robot.mouseToggle('up', 'left')
}
