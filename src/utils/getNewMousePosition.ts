export function getNewMousePosition(command: string, oldX: number, oldY: number) {
    const spaceIndex = command.indexOf(' ')
    const direction = command.substring(6, spaceIndex)
    const moveStep = +command.substring(spaceIndex + 1)
    switch (true) {
        case direction === 'up': {
            return [oldX, oldY - moveStep]
        }
        case direction === 'right': {
            return [oldX + moveStep, oldY]
        }
        case direction === 'down': {
            return [oldX, oldY + moveStep]
        }
        case direction === 'left': {
            return [oldX - moveStep, oldY]
        }
        default:
            return [oldX, oldY]
    }
}
