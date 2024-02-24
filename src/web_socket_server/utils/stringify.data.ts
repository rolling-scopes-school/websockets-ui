import { WebsocketTypes } from '../enum/websocket.types';

export const stringifyData = (data: any): string => {
    return JSON.stringify(data);
};

export const getWsSendData = (sendData: any, type: WebsocketTypes) => {
    const data = stringifyData(sendData);

    return stringifyData({
        type,
        data,
        id: 0,
    });
};
