import robot from 'robotjs'

export const drawCircle = (radius: number) => {
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
