import { WebSocket } from 'ws';
declare const printScreen: (ws: WebSocket, width?: number, height?: number) => Promise<void>;
export default printScreen;
