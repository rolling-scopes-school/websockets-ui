import WebSocket from "ws";
import { messages } from "./messages.js";
import { routes } from "./router.js";

export async function controller(connection: WebSocket.WebSocket, request: string) {
  // parse route, getCommand
  // parse parameters
  // command - run command?
  //   return data connection.send()

  try {
    const [commandRaw, ...parameters] = request.split(" ");
    const command = routes[commandRaw];

    if (!command) throw new Error(messages.ROUTE_NOT_FOUND);

    const output = await command(...parameters);
    console.log(
      '`${commandRaw}${output ? output : ""}\0`',
      `${commandRaw}${output ? output : ""}\0`
    );
    connection.send(`${commandRaw}${output ? output : ""}\0`);
  } catch (error) {
    connection.send(String(error));
  } finally {
    // connection.send("\0");
  }
}
