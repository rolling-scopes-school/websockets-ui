type CommandConfigType = {
  [key: string]: {
    action: (args: string[]) => Promise<any>;
    validate: (args: string[]) => boolean;
    formatResponse: (result: any) => string;
  };
};

export default CommandConfigType;
