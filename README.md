# Websocket Remote Control App

Sample remote control based on nutjs.dev, WebSocket and Jimp.
Includes frontend part ([remote-control](https://github.com/rolling-scopes-school/remote-control) rewritten to TypeScript)

## Installation

1. Clone this repository
2. Run command `npm i` to install required dependencies.
3. Rename `.env.example` to `.env` and configure ports in it if need.

## Running modes

1. Development with nodemon - `npm run start:dev`

- Frontend served by defaults @ `http://localhost:8181` with nodemon
- Backend served by defaults @ `http://localhost:8080`

2. Build - `npm run build`

- Builded app will be placed into `dist` folder

3. Build then run from `dist` folder - `npm run start`
