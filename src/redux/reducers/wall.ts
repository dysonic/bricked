import { Elevation } from '../../utils/elevation';
import {
  GENERATE_WALL,
  WallActionTypes,
} from '../types/wall';
import { generate } from '../../utils/elevation';

const wallReducer = (state = {}, action: WallActionTypes) => {
  console.log('action.type', action.type);
  switch (action.type) {
    case GENERATE_WALL: {
      const wall: Elevation = generate(action.options);
      const newState = { ...wall };
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default wallReducer;
