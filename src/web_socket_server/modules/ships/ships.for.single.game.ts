import { listOfBotShipScheme } from '../../local_data_base/local.bot.ship.scheme';

export const getBotShips = () => {
    const index =
        Math.floor(Math.random() * (listOfBotShipScheme.length - 0)) + 0;
    return listOfBotShipScheme[index]!;
};
