import { Direction } from './Direction';

export const WIDTH = 50;
export const HEIGHT = 50;
export const PIXEL_PER_UNIT = 10;

export const BORDER_COLORS = {
  SNAKE: '#5acc39',
  FOOD: '#cc395a',
};

export const FILL_COLORS = {
  SNAKE: '#5acc39',
  FOOD: '#cc395a',
};

export const GAME_SPEED_IN_MILLISECONDS = 100;

export const DIRECTION_KEYS: Record<number, Direction> = {
  38: Direction.Up,
  40: Direction.Down,
  37: Direction.Left,
  39: Direction.Right,
};
