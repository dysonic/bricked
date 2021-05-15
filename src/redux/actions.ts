import { createAction } from '@reduxjs/toolkit';
import { Options } from '../utils/wall';

export const updateBrickLength = createAction<number>('brick/update-length');
export const updateBrickWidth = createAction<number>('brick/update-width');
export const updateBrickHeight = createAction<number>('brick/update-height');
export const buildWall = createAction<Options>('wall/build');
