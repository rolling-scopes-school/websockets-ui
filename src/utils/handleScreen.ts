import Jimp from 'jimp'
import robot from 'robotjs'

export const captureScreen = async () => {
        const { x, y } = robot.getMousePos()
        const size = 200
        const newX = x - size / 2 >= 0 ? x - size / 2 : 0
        const newY = y - size / 2 >= 0 ? y - size / 2 : 0
        const bitmap = robot.screen.capture(newX, newY, size, size)
        const img = new Jimp(size * 2, size * 2)
        img.bitmap.data = bitmap?.image
        const buffer = await img.getBufferAsync(Jimp.MIME_PNG)
        const base64String = buffer.toString('base64')
        const result = 'prnt_scrn ' + base64String
        return result
}
