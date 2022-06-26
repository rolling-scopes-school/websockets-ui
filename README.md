# RSSchool NodeJS websocket task template

> Static http server and base task packages.

## Installation

1. Clone/download repo
2. `npm install`
3. rename .env.example to .env
4. pass variables
   `FRONT_PORT=3000`
   `SERVER_PORT=8080`

## Usage

**Development**

`npm run start:dev`

- App served @ `http://localhost:8080` with nodemon

**Production**

`npm run start`

- App served @ `http://localhost:8080` without nodemon

---

**All commands**

| Command         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | App served @ `http://localhost:8080` with nodemon    |
| `npm run start` | App served @ `http://localhost:8080` without nodemon |

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
