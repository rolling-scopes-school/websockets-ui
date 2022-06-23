import { drawLine } from "./drawLine"

export const drawSquare = (width: number) => {
    drawLine(width, 'right')
    drawLine(width, 'down')
    drawLine(width, 'left')
    drawLine(width, 'up')
}
