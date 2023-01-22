const parseIncomingData = (data: string) => {
  const [operation, ...args] = data.split(" ");

  return { operation, args };
};

const easingFunction = () => -0.6;

export { easingFunction, parseIncomingData };
