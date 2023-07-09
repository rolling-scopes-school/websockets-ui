import { RawData, Server } from "ws";

import { addShips, addUser, attack, createRoom, createUser } from "../game";

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
                case Commands.AddPlayer: {
                    const { indexRoom } = JSON.parse(response.data);

                    addUser(indexRoom, socket);

                    break;
                }
                case Commands.AddShip: {
                    const { gameId, ships, indexPlayer } = JSON.parse(response.data);

                    addShips(gameId, ships, indexPlayer);

                    break;
                }
                case Commands.Attack: {
                    const { x, y, gameId, indexPlayer } = JSON.parse(response.data);

                    attack(x, y, gameId, indexPlayer);

                    break;
                }
                default:
                    break;
            }
        })
    })
}
