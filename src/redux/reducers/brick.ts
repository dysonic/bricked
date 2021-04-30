import {
  UPDATE_BRICK_LENGTH,
  UPDATE_BRICK_WIDTH,
  UPDATE_BRICK_HEIGHT,
  BrickActionTypes,
} from '../types/brick';
import { Brick } from '../../types/brick';

const LOCAL_STORAGE_KEY = 'brick';

const brickJsonString:string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
const brick:Brick = brickJsonString ? JSON.parse(brickJsonString) : { width: 0, length: 0, height: 0 };
const initialState = brick;

const saveBrick = (newState:Brick): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
};

const brickReducer = (state = initialState, action: BrickActionTypes) => {
  switch (action.type) {
    case UPDATE_BRICK_LENGTH: {
      const newState = { ...state, length: action.value };
      saveBrick(newState);
      return newState;
    }
    case UPDATE_BRICK_WIDTH: {
      const newState = { ...state, width: action.value };
      saveBrick(newState);
      return newState;
    }
    case UPDATE_BRICK_HEIGHT: {
      const newState = { ...state, height: action.value };
      saveBrick(newState);
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default brickReducer;
