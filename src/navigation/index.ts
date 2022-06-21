import robot from 'robotjs';

export const mouseUp = (x, y, num) => {
    robot.moveMouse(x, y-num)
};

export const mouseDown = (x, y, num) => {
    robot.moveMouse(x, y+num)
}

export const mouseLeft = (x, y, num) => {
    robot.moveMouse(x-num, y)
}

export const mouseRight = (x, y, num) => {
    robot.moveMouse(x+num, y)
}