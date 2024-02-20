interface IRoomUsers {
    name: string;
    index: number;
}

export interface IRoomsListInterface {
    roomId: number;
    roomUsers: IRoomUsers[] | [];
}
