import { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server/index";
import screenShot from "./src/screenshot";
import mouseMove from "./src/mouse_move";
import mouseDraw from "./src/mouse_figures";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", (socket) => {
    socket.on("message", async (data: Buffer) => {
        try {
            const dataFront = data.toString("utf-8")
            const moveParam = dataFront.split(" ")

            if (moveParam[0].indexOf("draw") > -1) {
                await mouseDraw(moveParam)
            } else if (moveParam[0] === "prnt_scrn") {
                const img = await screenShot()
                socket.send(img, (err: any) => {
                    if (err) socket.close()
                })
            } else if (moveParam[0].indexOf("mouse") > -1) {
                const mousePosition = await mouseMove(moveParam)
                if (mousePosition) {
                    socket.send(mousePosition, (err: any) => {
                        if (err) socket.close()
                    })
                }
            }else{
                socket.send(dataFront, (err: any) => {
                    if (err) socket.close()
                })
            }
        } catch (error) {
            socket.send("error")
        }

    })
})