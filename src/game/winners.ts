import { Winners, WinnersArr } from "../types";

const winners: Winners = new Map();

export const addWin = (name: string): void => {
    let wins: number = 1;

    if (winners.get(name)) {
        wins = winners.get(name)! + 1;
    }
    
    winners.set(name, wins);
}

export const getWinners = (): WinnersArr[] => {
    const winnersArr: WinnersArr[] = [];

    for (const entry of winners.entries()) {
        winnersArr.push({
            name: entry[0],
            wins: entry[1]
        })
    }

    return winnersArr;
}