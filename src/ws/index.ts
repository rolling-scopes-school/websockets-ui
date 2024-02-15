import { WebSocket, WebSocketServer } from 'ws';

const PORT = 3000;

type PlayerId = number;
type GameId = number;
type RoomId = number;

type Player = {
    id: PlayerId;
    name: string;
    password: string;
}

type RoomUser = {
    name: string;
    index: PlayerId;
}

type Ship = {
    position: {
        x: number;
        y: number;
    };
    direction: boolean;
    length: number;
    type: 'small' | 'medium' | 'large' | 'huge';
}

type Room = {
    roomId: RoomId;
    roomUsers: RoomUser[];
};

type Game = {
    id: GameId;
    players: Record<PlayerId, Ship[]>;
}

const players: Player[] = [];
const games: Game[] = [];
let rooms: Room[] = [];
const winners: PlayerId[] = [];

const wsClientsMetadata: Map<number, WebSocket> = new Map();

export function createWSS() {
    const wss = new WebSocketServer({ port: PORT });

    function updateRooms(rooms: Room[]) {
        const roomsWithOnePlayer = rooms.filter((room) => room.roomUsers.length === 1);

        wss.clients.forEach((wsClient) => {
            wsClient.send(JSON.stringify({
                type: 'update_room',
                data: JSON.stringify(roomsWithOnePlayer),
                id: 0,
            }));
        });
    }

    function updateWinners() {
        // TODO
    }

    wss.on('connection', (ws) => {
        let currentPlayer: Player | undefined;

        function cleanup() {
            currentPlayer = undefined;
        }

        ws.on('message', (msg) => {
            try {
                const { id, type, data } = JSON.parse(msg.toString());

                if (type === 'reg') {
                    const { name, password } = JSON.parse(data);
                    const nextPlayerId = players.length;
                    const doesNameTaken = players.some((player) => player.name === name);

                    if (!doesNameTaken) {
                        currentPlayer = {
                            id: nextPlayerId,
                            name,
                            password,
                        };

                        players.push(currentPlayer);

                        wsClientsMetadata.set(nextPlayerId, ws);

                        ws.send(JSON.stringify({
                            type: 'reg',
                            data: JSON.stringify({
                                name,
                                index: nextPlayerId,
                                error: false,
                                errorText: '',
                            }),
                            id,
                        }));

                        updateRooms(rooms);
                        updateWinners();

                        return;
                    }

                    ws.send(JSON.stringify({
                        type: 'reg',
                        data: JSON.stringify({
                            name,
                            index: -1,
                            error: true,
                            errorText: 'Name is already taken',
                        }),
                        id,
                    }));
                } else if (type === 'create_room') {
                    if (!currentPlayer) {
                        // TODO: Error
                        return;
                    }

                    const nextRoomId = rooms.length;

                    rooms.push({
                        roomId: nextRoomId,
                        roomUsers: [{
                            name: currentPlayer.name,
                            index: currentPlayer.id,
                        }],
                    });

                    updateRooms(rooms);
                    updateWinners();
                } else if (type === 'add_user_to_room') {
                    if (!currentPlayer) {
                        // TODO: Error
                        return;
                    }

                    const { indexRoom } = JSON.parse(data);

                    const targetRoomIndex = rooms.findIndex((room) => room.roomId === indexRoom);

                    if (targetRoomIndex === -1) {
                        // TODO: error
                        return;
                    }

                    const targetRoom = rooms[targetRoomIndex];
                    const nextGameId = games.length;
                    const roomCreatorPlayerId = targetRoom.roomUsers.at(0)?.index;

                    if (roomCreatorPlayerId === undefined) {
                        // TODO error
                        return;
                    }

                    const roomCreatorWs = wsClientsMetadata.get(roomCreatorPlayerId);

                    if (!roomCreatorWs) {
                        // TODO error
                        return;
                    }

                    rooms = [...rooms.slice(0, targetRoomIndex), ...rooms.slice(targetRoomIndex + 1)];

                    updateRooms(rooms);

                    const game: Game = {
                        id: nextGameId,
                        players: {
                            [roomCreatorPlayerId]: [],
                            [currentPlayer.id]: [],
                        }
                    };

                    games.push(game);

                    [ws, roomCreatorWs].forEach((ws) => {
                        ws.send(JSON.stringify({
                            type: 'create_game',
                            data: JSON.stringify({
                                idGame: game.id,
                                idPlayer: id,
                            }),
                            id: 0,
                        }));
                    });
                } else if (type === 'add_ships') {
                    const { gameId, ships, indexPlayer } = JSON.parse(data);

                    const gameIndexToUpdate = games.findIndex((game) => game.id === gameId);

                    if (gameIndexToUpdate !== -1) {
                        games[gameIndexToUpdate].players[indexPlayer] = ships;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        })

        ws.on('close', cleanup);
    })

    wss.on('listening', () => {
        console.log(`WS server is listening on ${PORT} port!`)
    })

    return wss;
}

