import robot from 'robotjs'

const drawCircle = (radius: number) => {
    const mousePos = robot.getMousePos()
    robot.mouseToggle('down', 'left')
    for (let i = Math.PI * 2; i >= 0; i -= 0.01) {
        const x = mousePos.x - (radius * Math.cos(i))
        const y = mousePos.y + (radius * Math.sin(i))

        robot.dragMouse(x, y)
    }
    robot.mouseToggle('up', 'left')
    robot.moveMouse(mousePos.x, mousePos.y)
}

const drawLine = (length: number, destination: string) => {
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

const drawSquare = (width: number) => {
    const mousePos = robot.getMousePos()
    drawLine(width, 'right')
    drawLine(width, 'down')
    drawLine(width, 'left')
    drawLine(width, 'up')
}

export const handleDraw = (command: string) => {
    const spaceIndex = command.indexOf(' ')
    const figure = command.substring(5, spaceIndex)
    const size = +command.substring(spaceIndex + 1)
    switch (true) {
        case figure === 'circle': {
            drawCircle(size)
            break
        }
        case figure === 'square': {
            drawSquare(size)
            break
        }
        case figure === 'rectangle': {
            drawCircle(size)
            break
        }
        default:
            break
    }
}