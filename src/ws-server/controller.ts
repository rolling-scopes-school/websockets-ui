import { messages } from "./messages.js";
import { routes } from "./router.js";
import { Duplex } from "stream";

export async function controller(duplex: Duplex, request: string) {
  try {
    const [commandName, ...parameters] = request.split(" ");
    const command = routes[commandName];

    if (!command) throw new Error(messages.ROUTE_NOT_FOUND);

    const output = await command(...parameters);
    duplex.write(`${commandName}${output ? output : ""}\0`);
  } catch (error) {
    duplex.write(String(error));
  }
}
