import { Commands, ExtendedWebSocket, Room, RoomModified, User } from "./types";

let userIndex: number = 1;
const users: User[] = [];
const rooms: Map<number, Room> = new Map();

export const createUser = (name: string, password: string, socket: ExtendedWebSocket): void => {
    const index: number = userIndex++;

    socket.name = name;
    socket.id = index;

    users.push({ name, password, socket, inGame: false });

    socket.send(JSON.stringify({
        type: Commands.Registration,
        data: JSON.stringify({
            name,
            index,
            error: false,
            errorText: "",
        }),
        id: 0,
    }));

    updateRooms();
}

export const updateRooms = (): void => {
    const data: RoomModified[] = getAllFreeRoms();    

    users.filter((user: User) => !user.inGame).forEach((user: User) => user.socket.send(JSON.stringify({
        type: Commands.UpdateRoom,
        data: JSON.stringify(data),
        id: 0,
    })));
}


const getAllFreeRoms = (): RoomModified[] => {
    const roomsArr: RoomModified[]  = [];

    rooms.forEach((value, key) => {
        if (value.secondPlayer) {
            return;
        }

        roomsArr.push({
            roomId: key,
            roomUsers: [{
                name: value.firstPlayer.name,
                index: value.firstPlayer.id
            }]
        })
    });

    return roomsArr;
}
