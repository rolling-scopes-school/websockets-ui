import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const { API_PORT, CLIENT_PORT } = process.env;

export { API_PORT, CLIENT_PORT };
