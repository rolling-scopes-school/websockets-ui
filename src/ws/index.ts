import { WebSocketServer } from 'ws';
import config from '../config';

const DEFAULT_PORT = 8080;

const port = config.port ? +config.port : DEFAULT_PORT;




