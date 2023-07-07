import { ExtWebSocket, FrontRoomData, Room, Ship } from "../types";
import { COMMANDS } from "../types/enum";

export class Game implements Game {
    playerOne: ExtWebSocket;
    playerTwo: ExtWebSocket;
    shotPlayer: ExtWebSocket;
    idRoom: number

    constructor(playerOne: ExtWebSocket, playerTwo: ExtWebSocket, idRoom: number) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.idRoom = idRoom;
        this.shotPlayer = this.playerOne;
    }

    addPLayer(wsClient: ExtWebSocket): void {
        if (this.playerOne.index !== wsClient.index) {
            this.playerTwo = wsClient;
            this.openRoom();
        }
    }

    addShip(ships: Ship[], indexPLayer: number): void {
        [this.playerOne, this.playerTwo].map((player) =>
            (player.index === indexPLayer)
                ? player.ships = ships
                : ''
        );
        this.checkStartGame();
    }

    private startGame(): void {
        [this.playerOne, this.playerTwo].map((player) => player.send(JSON.stringify({
            type: "start_game",
            data: JSON.stringify(
                {
                    ships: player.ships,
                    currentPlayerIndex: player.index
                }),
            id: 0,
        })));
        this.turnPlayer();
    }

    attack() {

    }

    private openRoom() {
        [this.playerOne, this.playerTwo].map((player) => player.send(JSON.stringify({
            type: "create_game",
            data:
                JSON.stringify({
                    idGame: this.idRoom,
                    idPlayer: player.index,
                }),
            id: 0,
        })))

    }

    private checkStartGame() {
        if (this.playerOne.ships && this.playerTwo.ships) {
            this.startGame();
        }
    }

    private turnPlayer() {
        [this.playerOne, this.playerTwo].map((player) => player.send(JSON.stringify({
            type: COMMANDS.turn,
            data: JSON.stringify(
                {
                    currentPlayer: this.shotPlayer.index,
                }),
            id: 0,
        }
        )))
    }

}