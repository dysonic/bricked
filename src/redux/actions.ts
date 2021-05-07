import {
  UPDATE_BRICK_LENGTH,
  UPDATE_BRICK_WIDTH,
  UPDATE_BRICK_HEIGHT,
  BrickActionTypes,
} from './types/brick';
import { GENERATE_WALL, WallActionTypes } from './types/wall';
import { GenerateWallOptions } from '../types/wall';

export const updateBrickLength = (value:number): BrickActionTypes => ({
  type: UPDATE_BRICK_LENGTH,
  value,
});

export const updateBrickWidth = (value:number): BrickActionTypes => ({
  type: UPDATE_BRICK_WIDTH,
  value,
});

export const updateBrickHeight = (value:number): BrickActionTypes => ({
  type: UPDATE_BRICK_HEIGHT,
  value,
});

export const generateWall = (options: GenerateWallOptions): WallActionTypes => ({
  type: GENERATE_WALL,
  options,
})
