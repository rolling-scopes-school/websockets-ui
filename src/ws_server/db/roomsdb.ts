import { Room, User } from '../types';

const START_INDEX = 1;
type dbRooms = { [id: number]: Room };

export class RoomsDB {
    private rooms:dbRooms;
    private index:number;

    constructor () {
        this.rooms = {};
        this.index = START_INDEX;
    };

    create(index: number, name: string): Room {
        let newRoom:Room;

        newRoom = {
            roomId:this.index++,
            roomUsers: [{index, name}]
        }
        this.rooms[newRoom.roomId] = newRoom;

        return newRoom;
    };

    listRoomsSingleUser():Room[] {
        const roomsArr = Object.values(this.rooms);
        return roomsArr.filter((item) => {
            if(item) {
                return item.roomUsers.length === 1;
            }
        })
    }

    addToRoom(roomIdTo: number, roomIdFrom: number): Room {
        const newUser = this.rooms[roomIdFrom].roomUsers.pop();
        if(newUser) { 
            this.rooms[roomIdTo].roomUsers.push((newUser))
            delete this.rooms[roomIdFrom];
        }
        return this.rooms[roomIdTo];
    }
}