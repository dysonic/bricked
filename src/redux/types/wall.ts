import { GenerateWallOptions } from '../../types/wall';

export const GENERATE_WALL = 'GENERATE_WALL';

interface GenerateWallAction {
  type: typeof GENERATE_WALL,
  options: GenerateWallOptions,
}

export type WallActionTypes = GenerateWallAction;
