import { createAction } from '@reduxjs/toolkit';
import { BrickDimension } from '../types/brick-dimension';
import { Options } from '../utils/wall';

export const changeBrick = createAction<BrickDimension>('brick/change');
export const buildWall = createAction<Options>('wall/build');
