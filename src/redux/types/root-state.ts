import { BrickDimension } from '../../types/brick-dimension';
import { Wall } from '../../types/wall';

export interface RootState {
  brick: BrickDimension,
  wall: Wall,
}
