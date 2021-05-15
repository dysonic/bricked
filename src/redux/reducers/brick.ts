import { createReducer } from '@reduxjs/toolkit';
import { setBrick } from '../actions';
import { BrickDimension } from '../../types/brick-dimension';
import { STANDARD } from '../../constants/bricks';

const LOCAL_STORAGE_KEY = 'brick';

const brickJsonString: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
const brick: BrickDimension = brickJsonString ? JSON.parse(brickJsonString) : STANDARD;

const saveBrick = (brick: BrickDimension): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(brick));
};

export const brickReducer = createReducer(brick, (builder) => {
  builder
    .addCase(setBrick, (state, action) => {
      console.log(`setBrick action - brick: ${action.payload.id}`);
      state = action.payload;
      saveBrick(state);
    });
});
