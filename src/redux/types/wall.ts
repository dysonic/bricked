import { Options } from '../../utils/wall';

export const GENERATE_WALL = 'GENERATE_WALL';

interface GenerateWallAction {
  type: typeof GENERATE_WALL,
  options: Options,
}

export type WallActionTypes = GenerateWallAction;
