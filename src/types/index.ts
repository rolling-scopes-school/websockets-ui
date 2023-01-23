export interface wsDataType {
  actionType: actionType,
  payload: object
}

export enum actionType {
  MOVE_LEFT = 'mouse_left',
  MOVE_RIGHT = 'mouse_right',
  MOVE_UP = 'mouse_up',
  MOVE_DOWN = 'mouse_down',
  DRAW_RECTANGLE = 'draw_rectangle',
  DRAW_SQUARE = 'draw_square',
  DRAW_CIRCLE = 'draw_circle',
  MOUSE_POSITION = 'mouse_position',
  PRINT_SCREEN = 'prnt_scrn',
}