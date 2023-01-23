export const parseIncomingData = (data: string) => {
  const [operation, ...args] = data.split(" ");

  return { operation, args };
};
