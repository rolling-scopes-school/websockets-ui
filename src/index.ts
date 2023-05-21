import { httpServer } from "./http_server/index.ts";

const HTTP_PORT = 5000;

httpServer.listen(HTTP_PORT, () => {
    console.log(`Static http server started on the ${HTTP_PORT} port!`);
});

