import ActionInterface from '../action/ActionInterface';

type CommandConfigType = {
  [key: string]: (args: string[]) => ActionInterface;
};

export default CommandConfigType;
