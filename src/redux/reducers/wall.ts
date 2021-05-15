import { createReducer } from '@reduxjs/toolkit';
import { Wall } from '../../types/wall';
import { buildWall as buildWallAction } from '../actions';
import { buildWall } from '../../utils/wall';

const LOCAL_STORAGE_KEY = 'wall';

const wallJsonString:string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
let wall:Wall | null = null;
if (wallJsonString) {
  wall = JSON.parse(wallJsonString);
}

const initialState = wall;

const saveWall = (newState:Wall): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
};

export const wallReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(buildWallAction, (state, action) => {
      const wall: Wall | null = buildWall(action.payload);
      if (wall) {
        saveWall(wall);
        state = wall;
      }
    });
});
