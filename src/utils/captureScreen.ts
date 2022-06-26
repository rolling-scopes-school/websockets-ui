import Jimp from 'jimp'
import robot from 'robotjs'

const getValidatedMousePos = (currentMousePos: number, direction: string, size: number): number => {
        let result = 0
        let maxPosition = 0
        if (direction === 'x') {
                maxPosition = robot.getScreenSize().width
        }
        if (direction === 'y') {
                maxPosition = robot.getScreenSize().height
        }
        if (currentMousePos + size > maxPosition) {
                result = maxPosition - size
        } else if (currentMousePos - size / 2 >= 0) {
                result = currentMousePos - size / 2
        }
        return result
}

export const captureScreen = async () => {
        try {
                const { x, y } = robot.getMousePos()
                const { width: maxX, height: maxY } = robot.getScreenSize()
                const size = 200
                let newX = getValidatedMousePos(x, 'x', size)
                let newY = getValidatedMousePos(y, 'y', size)
                const bitmap = robot.screen.capture(newX, newY, size, size)
                const img = new Jimp(size * 2, size * 2)
                img.bitmap.data = bitmap?.image
                const buffer = await img.getBufferAsync(Jimp.MIME_PNG)
                const base64String = buffer.toString('base64')
                const result = 'prnt_scrn ' + base64String
                return result
        }
        catch (e) {
                console.log('captureScreen error', e)
        }
}
