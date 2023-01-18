import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const { CLIENT_PORT } = process.env;
const WEBSOCKET_SERVER_PORT = Number(process.env['WEBSOCKET_SERVER_PORT']);

export { WEBSOCKET_SERVER_PORT, CLIENT_PORT };
