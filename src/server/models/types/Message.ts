import { EventType } from '../enums/Events.enum';
import { ClientData } from './ClientData';
import { ServerData } from './ServerData';

export interface WSMessage {
  type: EventType;
  data: ClientData | ServerData;
  id: 0;
}
