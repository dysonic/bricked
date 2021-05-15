import { createReducer } from '@reduxjs/toolkit';
import { updateBrickLength, updateBrickWidth, updateBrickHeight } from '../actions';
import { BrickDimension } from '../../types/brick-dimension';

const LOCAL_STORAGE_KEY = 'brick';

const brickJsonString: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
const brick: BrickDimension = brickJsonString ? JSON.parse(brickJsonString) : { width: 0, length: 0, height: 0 };
const initialState = brick;

const saveBrick = (newState: BrickDimension): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
};


export const brickReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(updateBrickLength, (state, action) => {
      state.length = action.payload;
      saveBrick(state);
    })
    .addCase(updateBrickWidth, (state, action) => {
      state.width = action.payload;
      saveBrick(state);
    })
    .addCase(updateBrickHeight, (state, action) => {
      state.height = action.payload;
      saveBrick(state);
    });
});
