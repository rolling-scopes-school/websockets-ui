import robot from "robotjs";
import type { 
    IMousePosition,
    // IScreen 
    } from "../interfaces";

// const screen: IScreen= robot.getScreenSize();
let mouse:IMousePosition = robot.getMousePos()
export async function circle(radius:number){
    console.log(mouse)
    let upCord = mouse.y - radius
    let downCord = mouse.y + radius
    let rightCord = mouse.x + radius
    let leftCord = mouse.x - radius
    console.log('up y =',upCord,' , right x =',rightCord,' , down y =',downCord,' , left x =',leftCord)
}

export async function square(x:number,y?:number){ // SUCCESS
    if(x !== y ){
        y = x
    }
    rightMouse(x)
    mouse = {...robot.getMousePos()}
    downMouse(y)
    mouse = {...robot.getMousePos()}
    leftMouse(y)
    mouse = {...robot.getMousePos()}
    upMouse(y)
    mouse = {...robot.getMousePos()}
}

export async function rectangle(x:number,y?:number){
    if(!y) y = x + 200
    if(x == y) y += 200
    if(x + 50 >= y) y += 100
    rightMouse(x)
    mouse = {...robot.getMousePos()}
    downMouse(y)
    mouse = {...robot.getMousePos()}
    leftMouse(x)
    mouse = {...robot.getMousePos()}
    upMouse(y)
    mouse = {...robot.getMousePos()}
}
rectangle(100)
function rightMouse(movx:number):void{
    let x: number = mouse.x 
    
    for( let i = mouse.x; i < (x + movx) ; i++){
        if(i == x + movx){
            break
        }
        robot.moveMouse(i,mouse.y)
    }
}

function leftMouse(movx:number){
    let x: number = mouse.x 
    
    for( let i = mouse.x; i > (x - movx) ; i--){
        if(i == x - movx){
            break
        }
        robot.moveMouse(i,mouse.y)
    }
}

function downMouse(movy:number):void{
    let x = mouse.x
    let y = mouse.y

    for( let i = y ; i < (y + movy); i++ ){
        if(i == y + movy){
            break
        }
        robot.moveMouse(x,i)
    }
}

function upMouse(movy:number):void{
    let x = mouse.x
    let y = mouse.y

    for( let i = y ; i > (y - movy); i-- ){
        if(i == y - movy){
            break
        }
        robot.moveMouse(x,i)
    }
}
