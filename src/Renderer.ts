import { Coordinate } from './Coordinate';
import {
  PIXEL_PER_UNIT,
  WIDTH,
  HEIGHT,
  FILL_COLORS,
  BORDER_COLORS,
} from './constants';

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
  }

  render(food: Coordinate, snake: Array<Coordinate>) {
    this.context.clearRect(
      0,
      0,
      WIDTH * PIXEL_PER_UNIT,
      HEIGHT * PIXEL_PER_UNIT
    );

    snake.forEach((coordinate) => this.drawCoordinate('SNAKE', coordinate));

    this.drawCoordinate('FOOD', food);
  }

  private drawCoordinate(entity: 'FOOD' | 'SNAKE', coordinate: Coordinate) {
    this.context.fillStyle = FILL_COLORS[entity];
    this.context.strokeStyle = BORDER_COLORS[entity];
    this.context.fillRect(
      coordinate.x * PIXEL_PER_UNIT,
      coordinate.y * PIXEL_PER_UNIT,
      PIXEL_PER_UNIT,
      PIXEL_PER_UNIT
    );
    this.context.strokeRect(
      coordinate.x * PIXEL_PER_UNIT,
      coordinate.y * PIXEL_PER_UNIT,
      PIXEL_PER_UNIT,
      PIXEL_PER_UNIT
    );
  }
}
