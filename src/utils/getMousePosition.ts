import robot from 'robotjs'

export const getMousePosition = (): Number[] => {
    try {
        const { x, y } = robot.getMousePos()
        throw new Error()
        return [x, y]
    }
    catch (e) {
        console.log('getMousePosition error', e)
        return [0, 0]
    }
}
