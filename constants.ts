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

export const STATUS_COD: Readonly<{ OK: 200; NOT_FOUND: 404 }> = Object.freeze({
  OK: 200,
  NOT_FOUND: 404,
});

export const DELAY: Readonly<{ CUSTOM: 500; DEFAULT: 10 }> = Object.freeze({
  CUSTOM: 500,
  DEFAULT: 10,
});

export const MOUSE: Readonly<{ DOWN: 'down'; UP: 'up' }> = Object.freeze({
  DOWN: 'down',
  UP: 'up',
});

export const PRINT_SCREEN_IMAGE_SIZE: number = 200;

export const BASE_64_FORMAT: BufferEncoding = 'base64';
