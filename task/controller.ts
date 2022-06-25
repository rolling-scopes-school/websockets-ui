import MouseMove from "./app_functions/mouse_move";
import DrawCircle from "./app_functions/draw_circle";
import SendMousePos from "./app_functions/mouse_position";
import DrawRectangle from "./app_functions/draw_rectangle";
import PrintScreen from "./app_functions/print";


export async function Controller(message: any) {
  let messageText = message[0];
    if(messageText === "mouse_down"){
      MouseMove(0, +message[1]);
      return "mouse_down"
    }else if(messageText === "mouse_up"){
      MouseMove(0, +message[1] * -1);
      return "mouse_up"
    }else if(messageText === "mouse_left"){
      MouseMove(+message[1] * -1);
      return "mouse_left";
    }else if(messageText === "mouse_right"){
      MouseMove(+message[1]);
      return "mouse_right";
    }else if(messageText === "mouse_position"){
      return `mouse_position ${SendMousePos()}`;
    }else if(messageText === "draw_circle"){
      DrawCircle(+message[1]);
      return 'draw_circle';
    }else if(messageText === "draw_rectangle"){
      DrawCircle(+message[1]);
      return 'draw_circle';
    }else if(messageText === "draw_square"){
      DrawRectangle(+message[1]);
      return "draw_square";
    }else if(messageText === "prnt_scrn"){
      let png = await PrintScreen();
      return `prnt_scrn ${png}`
    }else{
      console.warn("Wrong command");
      return;
    }
  }