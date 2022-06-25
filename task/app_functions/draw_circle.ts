import robot from "robotjs";

const DrawCircle = function(radius: number) {
    const mousePos = robot.getMousePos();
    let x = mousePos.x + radius * Math.cos(0);
    let y = mousePos.y + radius * Math.sin(0);
    robot.moveMouse(x, y);
    robot.mouseToggle("down");
    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      x = mousePos.x + radius * Math.cos(i);
      y = mousePos.y + radius * Math.sin(i);
  
      robot.dragMouse(x, y);
    }
    robot.mouseToggle("up");
  }

export default DrawCircle;