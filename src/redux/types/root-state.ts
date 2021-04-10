import { Brick } from '../../types/brick';
import { Elevation } from '../../utils/elevation';

export interface RootState {
  brick: Brick,
  wall: Elevation,
}
