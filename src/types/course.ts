import { Brick } from './brick';

export interface Course {
  id: string;
  n: number;
  height: number;
  bricks:  Array<Brick>;
}
