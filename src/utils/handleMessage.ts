import robot from 'robotjs'
import { getNewMousePosition } from './getNewMousePosition'
import { handleDraw } from './handleDraw'
import { captureScreen } from './captureScreen'
import { getMousePosition } from './getMousePosition'

export const handleMessage = async (parsedMessage: string) => {
    switch (true) {
        case parsedMessage === 'mouse_position': {
            return `mouse_position ${getMousePosition()}`
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
        case parsedMessage === 'prnt_scrn': {
            console.log(parsedMessage)
            const result = await captureScreen()
            return result
        }
        default:
            return 'unknow command'
    }
}