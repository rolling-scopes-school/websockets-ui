export const COMMANDS: Readonly<{
  MOUSE_POSITION: 'mouse_position';
  MOUSE_UP: 'mouse_up';
  MOUSE_LEFT: 'mouse_left';
  MOUSE_RIGHT: 'mouse_right';
  MOUSE_DOWN: 'mouse_down';
  DRAW_CIRCLE: 'draw_circle';
  DRAW_SQUARE: 'draw_square';
  DRAW_RECTANGLE: 'draw_rectangle';
  PRINT_SCREEN: 'prnt_scrn';
}> = Object.freeze({
  MOUSE_POSITION: 'mouse_position',
  MOUSE_UP: 'mouse_up',
  MOUSE_LEFT: 'mouse_left',
  MOUSE_RIGHT: 'mouse_right',
  MOUSE_DOWN: 'mouse_down',
  DRAW_CIRCLE: 'draw_circle',
  DRAW_SQUARE: 'draw_square',
  DRAW_RECTANGLE: 'draw_rectangle',
  PRINT_SCREEN: 'prnt_scrn',
});

export const STATUS_COND: Readonly<{ OK: 200; NOT_FOUND: 404 }> = Object.freeze({
  OK: 200,
  NOT_FOUND: 404,
});
