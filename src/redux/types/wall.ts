import { GenerateOptions } from '../../utils/elevation';

export const GENERATE_WALL = 'GENERATE_WALL';

interface GenerateWallAction {
  type: typeof GENERATE_WALL,
  options: GenerateOptions,
}

export type WallActionTypes = GenerateWallAction;
