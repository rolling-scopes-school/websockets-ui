import { messages } from "./messages.js";
import { routes } from "./router.js";
import { Duplex } from "stream";

export async function controller(duplex: Duplex, request: string) {
  try {
    console.log("Received: %s", request);

    const [commandName, ...parameters] = request.split(" ");
    const command = routes[commandName];

    if (!command) throw new Error(messages.ROUTE_NOT_FOUND);

    const commandOutput = await command(...parameters);
    duplex.write(`${commandName}${commandOutput ? commandOutput : ""}\0`);
    console.log(
      `Request successfully processed, sending: `,
      `${commandName}${commandOutput ? commandOutput : ""}\0`
    );
  } catch (error) {
    duplex.write(String(error));
    console.error(`Error when processing request: `, error);
  }
}
