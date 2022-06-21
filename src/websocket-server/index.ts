import { WebSocketServer } from 'ws';

export default function startWebSocketServer(){
    let WS_PORT:number = 8080

    const ws:WebSocketServer = new WebSocketServer({
        port: WS_PORT,
    })

    ws.on('connection',()=>{
        console.log('User connection')
        
        ws.on('message',(message:string)=>{
            console.log(message)
        })
        
        
        ws.on('something',(message:string)=>{
            console.log('some ',message);

        })
    })
}