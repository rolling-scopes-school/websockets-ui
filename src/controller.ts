import WebSocket from "ws";
import { messages } from "./messages.js";
import { routes } from "./router.js";

export async function controller(connection: WebSocket.WebSocket, request: string) {
  try {
    const [commandName, ...parameters] = request.split(" ");
    const command = routes[commandName];

    if (!command) throw new Error(messages.ROUTE_NOT_FOUND);

    const output = await command(...parameters);
    connection.send(`${commandName}${output ? output : ""}\0`);
  } catch (error) {
    connection.send(String(error));
  }
}
