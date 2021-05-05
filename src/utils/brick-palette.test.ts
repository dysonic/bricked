import {
  _getShortestDimension,
  getRatios,
  BrickPalette,
  BrickRatio,
} from './brick-palette';
import { Elevation } from '../types/elevation';
import { Brick } from '../types/brick';
import { DOUBLE_FLEMISH_BOND as bond } from '../constants/bonds';

const brick: Brick = {
  length: 230,
  width: 110,
  height: 76,
};

const brickPalette: BrickPalette = {
  h: 110,
  s: 230,
  q: 50,
};

test('_getShortestDimension function', () => {
  const d: number = _getShortestDimension(brickPalette, brick.height);

  expect(d).toBe(50);
});

test('getRatios function', () => {
  const elevation: Elevation = {
    brick,
    bond,
    height: 0,
    width: 0,
    repeatPattern: 0,
    numberOfCourses: 0,
    brickPalette,
    verticalGauge: [],
    courses: [],
  };

  const brickRatio: BrickRatio = getRatios(elevation);

  expect(brickRatio).toEqual({
    height: 1.52,
    brickPalette: {
      h: 2.2,
      s: 4.6,
      q: 1,
    },
  });
});
