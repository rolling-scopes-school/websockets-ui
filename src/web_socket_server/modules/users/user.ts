import { UserInterface } from '../../interface/user.interface';

export class User {
    player = {} as UserInterface;
    constructor() {
        this.player;
    }

    getCurrentPlayer() {
        return this.player as UserInterface;
    }

    setCurrentPlayer(player: UserInterface) {
        this.player = player;
    }
}
