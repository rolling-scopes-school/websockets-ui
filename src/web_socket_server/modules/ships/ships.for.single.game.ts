import { listOfBotShipScheme } from '../../local_data_base/local.bot.ship.scheme';
import { IShipsFullInterface } from '../../interface/user.ships.interface';

export const getBotShips = (): IShipsFullInterface[] => {
    const index =
        Math.floor(Math.random() * (listOfBotShipScheme.length - 0)) + 0;
    return listOfBotShipScheme[index]!;
};
