import { RawData, Server } from "ws";

import { createRoom, createUser } from "../game";

import { ExtendedWebSocket, Response, Commands } from "../types";

export const wsServer = (port: number): void => {
    const wss = new Server(({ port }), () => console.log(`Start static http server on the ${port} port!`));

    wss.on("connection", (socket: ExtendedWebSocket) => {
        socket.on("message", async (data: RawData) => {
            const response: Response = JSON.parse(data.toString());

            switch (response.type) {
                case Commands.Registration: {
                    const { name, password } = JSON.parse(response.data);
                    
                    createUser(name, password, socket);

                    break;
                }
                case Commands.CreateRoom: {
                    createRoom(socket);

                    break;
                }
                default:
                    break;
            }
        })
    })
}
