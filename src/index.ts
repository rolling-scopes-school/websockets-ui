import { httpServer } from "./http-server";
import "dotenv/config";
import { wss } from "./websocket-server";

const APP_PORT: number = +process.env.APP_PORT || 3000;

httpServer.listen(APP_PORT, () => {
    console.log(`App Server running at http://localhost:${APP_PORT}/`);
});

process.on("SIGINT", async () => {
    httpServer.close();
    wss.close();
    process.exit();
});