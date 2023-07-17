export const CONSTANTS_TYPE = {
  REG: 'reg',
  UPDATE_WINNERS: 'update_winners',
  CREATE_ROOM: 'create_room',
  ADD_USER_TO_ROOM: 'add_user_to_room',
  CREATE_GAME: 'create_game',
  UPDATE_ROOM: 'update_room',
  ADD_SHIPS: 'add_ships',
  START_GAME: 'start_game',
  ATTACK: 'attack',
  RANDOM_ATTACK: 'randomAttack',
  TURN: 'turn',
  FINISH: 'finish',
  SINGLE_PLAY: 'single_play',
} as const;

export const CONSTANTS_STATUS = {
  MISS: 'miss',
  KILLED: 'killed',
  SHOT: 'shot',
} as const;

export const CONSTANTS_SHIP_TYPE = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  HUGE: 'huge',
} as const;

export const CONSTANTS_DATA_FIELDS = {
  TYPE: 'type',
  DATA: 'data',
  ID: 'id',
} as const;
