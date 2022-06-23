import robot from 'robotjs'

export const drawLine = (length: number, destination: string) => {
    const mousePos = robot.getMousePos()
    robot.mouseToggle('down', 'left')
    switch (destination) {
        case 'right': {
            for (let i = 0; i < length; i += 1) {
                robot.dragMouse(mousePos.x + i, mousePos.y)
            }
            break
        }
        case 'down': {
            for (let i = 0; i < length; i += 1) {
                robot.dragMouse(mousePos.x, mousePos.y + i)
            }
            break
        }
        case 'left': {
            for (let i = 0; i < length; i += 1) {
                robot.dragMouse(mousePos.x - i, mousePos.y)
            }
            break
        }
        case 'up': {
            for (let i = 0; i < length; i += 1) {
                robot.dragMouse(mousePos.x, mousePos.y - i)
            }
            break
        }
        default:
            break
    }
    robot.mouseToggle('up', 'left')
}
