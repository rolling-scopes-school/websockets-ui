import { WS_COMMAND_TYPES } from '../../constants';

const defineCoordinates = (parsedMessage: any) => {
  const parsedData = JSON.parse(parsedMessage?.data?.toString());

  const x =
    parsedMessage?.type === WS_COMMAND_TYPES.RANDOM_ATTACK
      ? Math.floor(Math.random() * 10)
      : parsedData.x;
  const y =
    parsedMessage?.type === WS_COMMAND_TYPES.RANDOM_ATTACK
      ? Math.floor(Math.random() * 10)
      : parsedData.y;

  return { x, y };
};

export default defineCoordinates;
