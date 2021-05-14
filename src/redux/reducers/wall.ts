import { Wall } from '../../types/wall';
import {
  GENERATE_WALL,
  WallActionTypes,
} from '../types/wall';
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

const wallReducer = (state = initialState, action: WallActionTypes) => {
  console.log('action.type', action.type);
  switch (action.type) {
    case GENERATE_WALL: {
      const wall: Wall | null = buildWall(action.options);
      if (wall) {
        const newState = { ...wall };
        saveWall(newState);
        return newState;
      }
      return state;
    }
    default: {
      return state;
    }
  }
};

export default wallReducer;
