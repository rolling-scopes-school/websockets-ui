import robot from "robotjs";

import { ActionsEnum } from "./constants";
import { drawCircle } from "./drawCircle";
import { drawRectangle } from "./drawRectangle";
import { moveMouse } from "./moveMouse";
import { printScreen } from "./printScreen";

export async function handleMessages(data: string) {
  let resultData = data;
  const arrData = data.trim().split(" ");
  const action = arrData[0];
  const size1 = Number(arrData[1]);
  const size2 = Number(arrData[2]);
  switch (action) {
    case ActionsEnum.Mouse_left:
      resultData = `${action} {${size1} px}`;
      moveMouse(-size1, 0);
      break;

    case ActionsEnum.Mouse_right:
      resultData = `${action} {${size1} px}`;
      moveMouse(size1, 0);
      break;

    case ActionsEnum.Mouse_up:
      resultData = `${action} {${size1} px}`;
      moveMouse(0, -size1);
      break;

    case ActionsEnum.Mouse_down:
      resultData = `${action} {${size1} px}`;
      moveMouse(0, size1);
      break;

    case ActionsEnum.Mouse_position:
      const mousePos = robot.getMousePos();
      return `mouse_position ${mousePos.x}px,${mousePos.y}px`;

    case ActionsEnum.Draw_rectangle:
      resultData = `${action} {${size1} px}, {${size2} px}`;
      drawRectangle(size1, size2);
      break;

    case ActionsEnum.Draw_square:
      resultData = `${action} {${size1} px}`;
      drawRectangle(size1, size1);
      break;

    case ActionsEnum.Draw_circle:
      resultData = `${action} {${size1} px}`;
      drawCircle(size1);
      break;

    case ActionsEnum.Prnt_scrn:
      return (resultData = await printScreen());
      break;

    default:
      break;
  }
  resultData = resultData.replace(/ /g, "\0\t");
  resultData = `${resultData}\0`
  return resultData;
}
