import { createAction } from '@reduxjs/toolkit';
import { BrickDimension } from '../types/brick-dimension';
import { Options } from '../utils/wall';

export const setBrick = createAction<BrickDimension>('brick/set');
export const buildWall = createAction<Options>('wall/build');
