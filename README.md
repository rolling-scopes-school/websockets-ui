# RSSchool NodeJS websocket
> Implementation of the remote control server part using the RobotJS library and a web socket.

## Installation
1. `git clone https://github.com/anna-left/remote-control`
2. `cd remote-control`
3. `git checkout develop`
4. `npm install`

## Usage
**Development**

You can change the launch ports in the file .env

default ports:

`FRONT_PORT=3000`

`BACK_PORT=8080`

**Production**

open 2 separate windows with one command:

- `npm run start` 

open 2 servers in different windows

- `npm run start:front` 

- `npm run start:back` 

**Development**

- `npm run start:devfront` 

- `npm run start:devback` 


---

**All commands**

Command | Mode | Description
--- | --- | ---
`npm run start` | prod | Back served @ `http://localhost:8080`, Front served @ `http://localhost:3000`
`npm run start:back` | prod | Back served @ `http://localhost:8080`
`npm run start:front` | prod | Front served @ `http://localhost:3000`
`npm run start:devback` | dev | Back served @ `http://localhost:8080`
`npm run start:devfront` | dev | Front served @ `http://localhost:3000`
---

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

## Author

Anna Rybakova(@anna-left)

https://t.me/AnnaFavor

If you have any questions please contact me