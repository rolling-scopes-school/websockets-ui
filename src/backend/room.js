const rooms = [];

export const gameCanStart = (room) => {
  return (
    room.roomUsers.length >= 2 &&
    room.roomUsers.every((user) => user.ships?.length > 0)
  );
};

export const createRoom = () => {
  const roomId = rooms.length + 1;
  const roomUsers = [];
  const room = { roomId, roomUsers };
  rooms.push(room);
  return room;
};

export const deleteRoom = (roomId) => {
  const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
  rooms.splice(roomIndex, 1);
};

export const getRoom = (roomId) => {
  return rooms.find((room) => room.roomId === roomId);
};

export const getRoomByUser = (userIndex) => {
  return rooms.find((room) =>
    room.roomUsers.some((roomUser) => roomUser.index === userIndex)
  );
};

export const addRoomUser = (roomId, user) => {
  const room = getRoom(roomId);

  if (
    room.roomUsers.length === 2 ||
    room.roomUsers.some((roomUser) => roomUser.index === user.index)
  )
    return false;

  const roomUser = {
    name: user.name,
    index: user.index,
    ships: [],
    hits: [],
  };
  room.roomUsers.push(roomUser);
  return room;
};

export const getRoomUser = (roomId, userIndex) => {
  const room = getRoom(roomId);
  if (!room) {
    console.error("Room not found");
    return false;
  }
  return room.roomUsers.find((user) => user.index === userIndex);
};

export const getCurrentPlayer = (roomId) => {
  const room = getRoom(roomId);
  if (!room) {
    console.error("Room not found");
    return false;
  }
  const currentPlayer = room.roomUsers.find(
    (user) => user.index === room.currentPlayerIndex
  );
  return currentPlayer;
};

export const getNextPlayer = (roomId) => {
  const room = getRoom(roomId);
  if (!room) {
    console.error("Room not found");
    return false;
  }
  const nextPlayer = room.roomUsers.find(
    (user) => user.index !== room.currentPlayerIndex
  );
  return nextPlayer;
};

export const GetAponent = (roomId, userIndex) => {
  const room = getRoom(roomId);
  if (!room) {
    console.error("Room not found");
    return false;
  }
  const aponent = room.roomUsers.find((user) => user.index !== userIndex);
  return aponent;
};

export const getAvailableRooms = () =>
  rooms.reduce((prev, curr) => {
    if (curr.roomUsers.length < 2) {
      const roomUsers = curr.roomUsers.map((user) => {
        return {
          name: user.name,
          index: user.index,
        };
      });
      prev.push({
        roomId: curr.roomId,
        roomUsers: roomUsers,
      });
    }
    return prev;
  }, []);
