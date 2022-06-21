import { ActionsEnum } from "./constants";
import { drawCircle } from "./drawCircle";
import { drawRectangle } from "./drawRectangle";
import { moveMouse } from "./moveMouse";

export function handleMessages(data: string) {
  const arrData = data.trim().split(" ");
  const action = arrData[0];
  const size1 = Number(arrData[1]);
  const size2 = Number(arrData[2]);
  switch (action) {
    case ActionsEnum.Mouse_left:
      moveMouse(-size1, 0);
      break;

    case ActionsEnum.Mouse_right:
      moveMouse(size1, 0);
      break;

    case ActionsEnum.Mouse_up:
      moveMouse(0, -size1);
      break;

    case ActionsEnum.Mouse_down:
      moveMouse(0, size1);
      break;

    case ActionsEnum.Mouse_position:
      break;

    case ActionsEnum.Draw_rectangle:
      drawRectangle(size1, size2)
      break;

    case ActionsEnum.Draw_square:
      drawRectangle(size1, size1)
      break;

    case ActionsEnum.Draw_circle:
      drawCircle(size1);

      break;

    default:
      break;
  }

}
