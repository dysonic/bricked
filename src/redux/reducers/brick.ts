import { createReducer } from '@reduxjs/toolkit';
import { changeBrick } from '../actions';
import { STANDARD as brickDimension } from '../../constants/bricks';
import { findCoursingChartForBrickHeight } from '../../utils/coursing-chart';
import { BrickDimension } from '../../types/brick-dimension';

const createState = (brickDimension: BrickDimension) => {
  const coursingChart = findCoursingChartForBrickHeight(brickDimension.height);
  return {
    brickDimension,
    coursingChart,
  };
};

const initialState = createState(brickDimension);

export const brickReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeBrick, (state, action) => createState(action.payload));
});
