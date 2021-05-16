import { createReducer } from '@reduxjs/toolkit';
import { changeBrick } from '../actions';
import { STANDARD as initialState } from '../../constants/bricks';

export const brickReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeBrick, (state, action) => {
      console.log(`changeBrick action - brick: ${action.payload.id}`);
      state = action.payload;
    });
});
