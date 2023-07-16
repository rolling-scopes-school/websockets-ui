const users = [];

export const isUserExist = (name) => {
  return users.some((user) => user.name === name);
};

export const addUser = (name, password) => {
  const index = users.length + 1;
  const wins = 0;
  const user = { name, password, wins, index };
  users.push(user);
  return user;
};

export const getUser = (name) => {
  return users.find((user) => user.name === name);
};

export const checkUser = (name, password) => {
  return users.some((user) => user.name === name && user.password === password);
};

export const userWin = (name) => {
  const user = users.find((user) => user.name === name);
  user.wins++;
};

export const getWinners = () => {
  return users
    .filter((user) => user.wins > 0)
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10)
    .map((user) => {
      return {
        name: user.name,
        wins: user.wins,
      };
    });
};
