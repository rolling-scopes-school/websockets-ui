import { drawLine } from "./drawLine"

export const drawRectangle = (width: number, length: number) => {
    drawLine(width, 'right')
    drawLine(length, 'down')
    drawLine(width, 'left')
    drawLine(length, 'up')
}
