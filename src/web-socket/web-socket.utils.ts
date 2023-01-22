import { mouse, Point } from "@nut-tree/nut-js"
import { WsActions } from "./web-socket.constants"

export const getChangedPosition = async (action: WsActions, distance: string): Promise<Point> => {
    const position = await mouse.getPosition()

    switch (action) {
        case WsActions.mouseUp:
            position.y -= +distance
            break;

        case WsActions.mouseDown:
            position.y += +distance
            break;

        case WsActions.mouseLeft:
            position.x -= +distance
            break;

        case WsActions.mouseRight:
            position.x += +distance
            break;

        default:
            break
    }

    return position
}