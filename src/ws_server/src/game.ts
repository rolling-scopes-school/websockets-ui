import { AttackData, ExtWebSocket, Player, Room, Ship, cellShip, resultAttack } from "../types";
import { COMMANDS } from "../types/enum";

export class Game implements Game {
    playerOne: Player;
    playerTwo: Player;
    shotPlayer: Player;
    idRoom: number;
    isAttack: boolean;
    isBot: boolean;

    constructor(playerOne: Player, playerTwo: Player, idRoom: number, isBot: boolean) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.idRoom = idRoom;
        this.isAttack = true;
        this.shotPlayer = this.playerOne;
        this.isBot = isBot;
        this.checkSingleGame();
    }

    addPLayer(player: Player): void {
        if (this.playerOne.index !== player.index) {
            this.playerTwo = player;
            this.openRoom();
        }
    }

    addShip(ships: Ship[], indexPLayer: number): void {
        [this.playerOne, this.playerTwo].map((player) => {
            if (player.index === indexPLayer) {
                player.ships = ships;
                player.attackCell = [];
                player.ships.map((ship) => ship.rest = ship.length);
            }
        }
        );

        this.checkStartGame();
    }

    private startGame(): void {

        [this.playerOne, this.playerTwo].map((player) => {
            if (player.socket) {
                player.socket.send(JSON.stringify({
                    type: COMMANDS.startGame,
                    data: JSON.stringify(
                        {
                            ships: player.ships,
                            currentPlayerIndex: player.index
                        }),
                    id: 0,
                }))
            }
        });
        this.turnPlayer();
    }

    attack(attackData: AttackData): void {
        if (this.isAttack &&
            attackData.indexPlayer === this.shotPlayer.index &&
            this.checkRepeatShot(attackData.x, attackData.y, this.shotPlayer)
        ) {
            const attacked = [this.playerOne, this.playerTwo].filter(
                (player) => player.index !== attackData.indexPlayer)[0];
            this.shotPlayer.attackCell.push({ x: attackData.x, y: attackData.y });
            this.isAttack = false;
            this.shotProcessing(attackData.x, attackData.y, attacked);
        }
    }

    private generateRandomCoor = () => {
        return {
            x: Math.ceil(Math.random() * 9),
            y: Math.ceil(Math.random() * 9)
        }
    }

    randomAttack(): void {
        let coor = this.generateRandomCoor();
        if (this.checkRepeatShot(coor.x, coor.y, this.shotPlayer)) {
            this.attack(
                {
                    x: coor.x,
                    y: coor.y,
                    gameId: this.idRoom,
                    indexPlayer: this.shotPlayer.index
                }
            )
        } else {
            this.randomAttack();
        }
    }

    private openRoom() {
        [this.playerOne, this.playerTwo].map((player) => {
            if (player.socket) {
                player.socket.send(JSON.stringify({
                    type: "create_game",
                    data:
                        JSON.stringify({
                            idGame: this.idRoom,
                            idPlayer: player.index,
                        }),
                    id: 0,
                }))
            }
        })

    }

    private checkStartGame() {
        if (this.playerOne.ships && this.playerTwo.ships) {
            this.startGame();
        }
    }

    private turnPlayer() {
        [this.playerOne, this.playerTwo].map((player) => {
            if (player.socket) {
                player.socket.send(JSON.stringify({
                    type: COMMANDS.turn,
                    data: JSON.stringify(
                        {
                            currentPlayer: this.shotPlayer.index,
                        }),
                    id: 0,
                }
                ))
            };
        })
    }

    private cellShip(ship: Ship): cellShip {
        const xCoor: number[] = [ship.position.x];
        const yCoor: number[] = [ship.position.y];

        if (ship.direction) {
            for (let j = ship.position.y + 1; j < ship.position.y + ship.length; j++) {
                yCoor.push(j);
            }
        } else {
            for (let i = ship.position.x + 1; i < ship.position.x + ship.length; i++) {
                xCoor.push(i);
            }
        }
        return {
            xCoor,
            yCoor
        }
    }

    private shotProcessing(x: number, y: number, attacked: Player) {
        let isHit: number = 999;

        attacked.ships.map((ship, indexShip) => {
            const cellShip = this.cellShip(ship);
            (cellShip.xCoor.includes(x) && cellShip.yCoor.includes(y))
                ? isHit = indexShip
                : ''
        })

        if (isHit !== 999) {
            this.isAttack = true;
            this.turnPlayer();
            attacked.ships[isHit].rest -= 1;
            if (attacked.ships[isHit].rest === 0) {
                this.checkKilled(attacked.ships[isHit], attacked);
            } else {
                this.sendAttackAnswer(x, y, 'shot');
            }
            this.checkWinner(attacked);
        } else {
            this.isAttack = true;
            this.sendAttackAnswer(x, y, 'miss');
            this.shotPlayer = attacked;
            this.turnPlayer();
        }

    }

    private sendAttackAnswer(x: number, y: number, status: resultAttack) {
        if (this.shotPlayer.socket) {
            this.shotPlayer.socket.send(
                JSON.stringify({
                    type: COMMANDS.attack,
                    data: JSON.stringify(
                        {
                            position:
                            {
                                x,
                                y,
                            },
                            currentPlayer: this.shotPlayer.index,
                            status,
                        }),
                    id: 0,
                })
            )
        }
    }

    private sendWinner() {
        [this.playerOne, this.playerTwo].map((player) => {
            if (player.socket) {
                player.socket.send(
                    JSON.stringify({
                        type: COMMANDS.finish,
                        data: JSON.stringify(
                            {
                                winPlayer: this.shotPlayer.index,
                            }),
                        id: 0,
                    }))
            }
        })
    }

    private checkRepeatShot(x: number, y: number, player: Player): boolean {
        let result: boolean = true;
        player.attackCell.map((attackCell) =>
            (attackCell.x === x && attackCell.y === y) ? result = false : ''
        )
        return result;
    }

    private checkKilled(ship: Ship, attacked: Player) {
        let allCellMiss: cellShip = {
            xCoor: [],
            yCoor: []
        };
        const cellShip = this.cellShip(ship);

        if (ship.direction) {
            allCellMiss.xCoor = [ship.position.x - 1, ship.position.x, ship.position.x + 1];
            for (let j = ship.position.y - 1; j < ship.position.y + ship.length + 1; j++) {
                allCellMiss.yCoor.push(j);
            }
        } else {
            allCellMiss.yCoor = [ship.position.y - 1, ship.position.y, ship.position.y + 1];
            for (let i = ship.position.x - 1; i < ship.position.x + ship.length + 1; i++) {
                allCellMiss.xCoor.push(i)
            }
        }

        allCellMiss.xCoor.forEach((x) =>
            allCellMiss.yCoor.forEach((y) => {
                if (y >= 0 && y <= 9 && x >= 0 && x <= 9) {
                    this.sendAttackAnswer(x, y, 'miss');
                    this.shotPlayer.attackCell.push({ x, y });
                }
            })
        );

        cellShip.xCoor.forEach((x) =>
            cellShip.yCoor.forEach((y) =>
                this.sendAttackAnswer(x, y, 'killed'))
        );
    }

    private checkWinner(player: Player) {
        const slainShip = player.ships.filter(ship => ship.rest === 0);
        if (slainShip.length === 10) {
            this.sendWinner();
        }
    }

    checkSingleGame(){
        this.isBot ? this.addPLayer(this.createBot()) : '';
    }

    private createBot(): Player {
        return {
            index: Math.floor(Math.random() * Date.now()),
            userName: 'bot',
            password: 'bot',
            ships: [
                {
                    position: { x: 3, y: 2 },
                    direction: true,
                    type: 'huge',
                    length: 4,
                    rest: 4
                },
                {
                    position: { x: 5, y: 1 },
                    direction: false,
                    type: 'large',
                    length: 3,
                    rest: 3
                },
                {
                    position: { x: 5, y: 9 },
                    direction: false,
                    type: 'large',
                    length: 3,
                    rest: 3
                },
                {
                    position: { x: 0, y: 0 },
                    direction: false,
                    type: 'medium',
                    length: 2,
                    rest: 2
                },
                {
                    position: { x: 7, y: 3 },
                    direction: true,
                    type: 'medium',
                    length: 2,
                    rest: 2
                },
                {
                    position: { x: 1, y: 8 },
                    direction: false,
                    type: 'medium',
                    length: 2,
                    rest: 2
                },
                {
                    position: { x: 5, y: 4 },
                    direction: true,
                    type: 'small',
                    length: 1,
                    rest: 1
                },
                {
                    position: { x: 0, y: 2 },
                    direction: false,
                    type: 'small',
                    length: 1,
                    rest: 1
                },
                {
                    position: { x: 7, y: 6 },
                    direction: true,
                    type: 'small',
                    length: 1,
                    rest: 1
                },
                {
                    position: { x: 0, y: 5 },
                    direction: false,
                    type: 'small',
                    length: 1,
                    rest: 1
                }
            ],
            attackCell: [],
        }
    }

}