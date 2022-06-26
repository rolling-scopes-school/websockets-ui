Deadleine: 26-06-2022 23:59

Please show your dsicord contact details so I'd like to reach you too :)

Scoring: Websocket remote control

## Basic Scope

- Websocket
  - **+6** Implemented workable websocket server
  - **+10** Websocket server message handler implemented properly
  - **+10** Websocket server message sender implemented properly
- Navigation
  - **+4** Move mouse up implemented properly
  - **+4** Move mouse down implemented properly
  - **+4** Move mouse left implemented properly
  - **+4** Move mouse right implemented properly
  - **+4** Send mouse coordinates implemented properly
- Drawing
  - **+6** Draw circle implemented properly
  - **+6** Draw rectangle implemented properly
  - **+6** Draw square implemented properly
- Screen image
  - **+30** Send screen image implemented properly (optionally)

## Advanced Scope

- **+30** Task implemented on Typescript
- **+20** All data transfer operations with send/get should be performed using Streams API
- **+20** Codebase is separated (at least 4 modules)

## Forfeits

- **-95% of total task score** any external tools except `ws`, `robotjs`, `jimp`, `cross-env`, `dotenv`, `typescript`, `ts-node`, `ts-node-dev`, `nodemon`, `eslint` and its plugins, `webpack` and its plugins, `prettier`, `@types/*` and testing tools (for example, Jest, Mocha, AVA, Jasmine, Cypress, Storybook, Puppeteer)
- **-30% of total task score** Commits after deadline (except commits that affect only Readme.md, .gitignore, etc.)
- **-10** Missing PR or its description is incorrect
- **-10** No separate development branch
- **-10** Less than 3 commits in the development branch, not including commits that make changes only to `Readme.md` or similar files (`tsconfig.json`, `.gitignore`, `.prettierrc.json`, etc.)

# RSSchool NodeJS websocket task template

> Static http server and base task packages.

## Installation

1. Clone/download repo
2. `npm install`

## Usage

**Development**

`npm run start:dev`

- App served @ `http://localhost:{.env.PORT}` with nodemon. .env eviroment propositions please install by yourself. In case of problems please send me a message. I hide .env in case of privacy.

**Production**

`npm run start`

- App served @ `http://localhost:{.env.WSPORT}` without nodemon

---

**All commands**

Command | Description

List of websocket commands (all commands are made by keyborad with 'p', 'Left CTRL + P', key down, ect.)
and their syntax (<- - cmd from frontend, -> - answer):

- Navigation over the x and y axis
  - Move mouse up
  ```bash
  <- mouse_up {y px}
  ```
  - Move mouse down
  ```bash
  <- mouse_down {y px}
  ```
  - Move mouse left
  ```bash
  <- mouse_left {x px}
  ```
  - Move mouse right
  ```bash
  <- mouse_right {x px}
  ```
  - Send mouse coordinates
  ```bash
  <- mouse_position
  -> mouse_position {x px},{y px}
  ```
- Drawing
  - Draw circle with pushed left button:
  ```bash
  <- draw_circle {px}
  ```
  - Draw rectangle with pushed left button:
  ```bash
  <- draw_rectangle {px} {px}
  ```
  - Draw square with pushed left button:
  ```bash
  <- draw_square {px}
  ```
- Print screen
  - Make print screen command and send image (a base64 buffer of the 200 px square around the mouse position):
  ```bash
  <- prnt_scrn
  -> prnt_scrn {base64 string (png buf)}
  ```
