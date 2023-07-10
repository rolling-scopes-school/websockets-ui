export const updateRoom = () => {
    const updRoomRes = {
        type: "update_room",
        data: JSON.stringify(
            [
                {
                    roomId: 0,
                    roomUsers:
                        [
                            {
                                name: '123123',
                                index: 0    ,
                            }
                        ],
                },
            ]
        ),
        id: 0,
    };
    return [JSON.stringify(updRoomRes), true];
};
