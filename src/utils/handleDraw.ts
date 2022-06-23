import { drawCircle } from "./figures/drawCircle"
import { drawRectangle } from "./figures/drawRectangle"
import { drawSquare } from "./figures/drawSquare"

export const handleDraw = (command: string) => {
    const spaceIndex = command.indexOf(' ')
    const figure = command.substring(5, spaceIndex)
    const size = command.substring(spaceIndex + 1)
    switch (true) {
        case figure === 'circle': {
            drawCircle(+size)
            break
        }
        case figure === 'square': {
            drawSquare(+size)
            break
        }
        case figure === 'rectangle': {
            const spaceIndex = size.indexOf(' ')
            const width = +size.substring(0, spaceIndex)
            const length = +size.substring(spaceIndex)
            drawRectangle(width, length)
            break
        }
        default:
            break
    }
}
