import robot from 'robotjs'

export const drawCircle = (radius: number) => {
    try {
        const mousePos = robot.getMousePos()
        console.log(mousePos)
        robot.moveMouse(mousePos.x - radius, mousePos.y)
        setTimeout(() => {
            robot.mouseToggle('down', 'left')
            for (let i = Math.PI * 2; i >= 0; i -= 0.01) {
                const x = mousePos.x - (radius * Math.cos(i))
                const y = mousePos.y + (radius * Math.sin(i))

                robot.dragMouse(x, y)
            }
            robot.mouseToggle('up', 'left')
        }, 100)
    }
    catch (e) {
        console.log('drawCircle error', e)
    }
}
