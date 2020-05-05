import { Machine, assign } from 'xstate';

import { GAME_SPEED_IN_MILLISECONDS, WIDTH, HEIGHT } from './constants';
import { Coordinate } from './Coordinate';
import { Direction } from './Direction';

export interface GameContext {
  food: Coordinate;
  snake: Array<Coordinate>;
  currentDirection: Direction;
  nextDirection: Direction;
  score: number;
}

export const GameMachine = Machine<GameContext>(
  {
    id: 'game',
    initial: 'idle',
    context: getInitialContext(),
    states: {
      idle: {
        entry: assign(() => getInitialContext()),
        on: { DIRECTION: 'playing' },
      },
      playing: {
        invoke: {
          src: () => (cb) => {
            const interval = setInterval(() => {
              cb('TICK');
            }, GAME_SPEED_IN_MILLISECONDS);

            return () => {
              clearInterval(interval);
            };
          },
        },
        on: {
          '': {
            target: 'over',
            cond: 'hitSomething',
          },
          DIRECTION: {
            actions: 'changeDirection',
            cond: 'validMove',
          },
          TICK: {
            actions: 'move',
          },
        },
      },
      over: {
        on: { RESET: 'idle' },
      },
    },
  },
  {
    actions: {
      changeDirection: assign((context, event) => ({
        nextDirection: event.direction,
      })),
      move: assign((context) => {
        const oldHead = context.snake[0];

        let newHead: Coordinate;

        switch (context.nextDirection) {
          case Direction.Up: {
            newHead = new Coordinate(oldHead.x, oldHead.y - 1);
            break;
          }
          case Direction.Down: {
            newHead = new Coordinate(oldHead.x, oldHead.y + 1);
            break;
          }
          case Direction.Left: {
            newHead = new Coordinate(oldHead.x - 1, oldHead.y);
            break;
          }
          case Direction.Right: {
            newHead = new Coordinate(oldHead.x + 1, oldHead.y);
            break;
          }
        }

        const consumedFood = newHead.equals(context.food);

        const snake = [newHead!, ...context.snake];

        if (!consumedFood) {
          snake.pop();
        }

        return {
          currentDirection: context.nextDirection,
          food: consumedFood ? createFood(snake) : context.food,
          snake,
          score: snake.length - 4,
        };
      }),
    },
    guards: {
      hitSomething: (context) => {
        const [head, ...rest] = context.snake;

        const bodyHit = rest.some((part) => head.equals(part));

        const hitLeftWall = head.x < 0;
        const hitRightWall = head.x >= WIDTH;
        const hitTopWall = head.y < 0;
        const hitBottomWall = head.y >= HEIGHT;

        return (
          bodyHit || hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
        );
      },
      validMove: (context, event) => {
        const current = context.currentDirection;
        const next = event.direction;

        const illegalMove =
          (current === Direction.Left && next === Direction.Right) ||
          (current === Direction.Right && next === Direction.Left) ||
          (current === Direction.Up && next === Direction.Down) ||
          (current === Direction.Down && next === Direction.Up);

        return !illegalMove;
      },
    },
  }
);

function createFood(snake: Array<Coordinate>) {
  let food: Coordinate;

  do {
    const x = Math.floor(Math.random() * Math.floor(WIDTH));
    const y = Math.floor(Math.random() * Math.floor(HEIGHT));
    food = new Coordinate(x, y);
  } while (snake.some((body) => body.equals(food)));

  return food;
}

function getInitialBody() {
  const x = Math.floor(WIDTH / 2);
  const y = Math.floor(HEIGHT / 2);

  return [
    new Coordinate(x, y),
    new Coordinate(x - 1, y),
    new Coordinate(x - 2, y),
    new Coordinate(x - 3, y),
  ];
}

function getInitialContext() {
  const snake = getInitialBody();

  return {
    food: createFood(snake),
    snake,
    currentDirection: Direction.Right,
    nextDirection: Direction.Right,
    score: 0,
  };
}
