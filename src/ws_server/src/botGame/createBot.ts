import { Player } from "../../types"
import { shipsBot } from "./shipsBot"

export const createBot = (): Player => {
    return {
        index: Math.floor(Math.random() * Date.now()),
        userName: 'bot',
        password: 'bot',
        ships: shipsBot[Math.round(Math.random() * 3)],
        attackCell: [],
    }
}