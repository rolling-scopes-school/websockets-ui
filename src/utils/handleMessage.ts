import robot from 'robotjs'
import { getNewMousePosition } from './getNewMousePosition'
import { handleDraw } from './handleDraw'

export const handleMessage = (parsedMessage: string) => {
    switch (true) {
        case parsedMessage === 'mouse_position': {
            const { x, y } = robot.getMousePos()
            return `mouse_position ${[x, y]}`
        }
        case parsedMessage.startsWith('mouse_'): {
            const { x, y } = robot.getMousePos()
            const [newX, newY] = getNewMousePosition(parsedMessage, x, y)
            robot.moveMouse(newX, newY)
            return 'mouse_move'
        }
        case parsedMessage.startsWith('draw_'): {
            handleDraw(parsedMessage)
            return parsedMessage
        }
        default:
            return 'unknow command'
    }
}