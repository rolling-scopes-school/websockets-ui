export const updateRoom = () => {
    const updRoomRes = {
        type: "update_room",
        data: JSON.stringify(
            {
                rooms : [
                    {
                        roomId: 0,
                        roomUsers:
                            [
                                {
                                    name: '123123',
                                    index: 123,
                                }
                            ],
                    },
                ]
            },
        ),
        id: 0,
    };
    return [JSON.stringify(updRoomRes), true];
};
