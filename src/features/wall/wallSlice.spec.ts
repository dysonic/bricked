import { STANDARD as brick } from '../../common/constants/bricks';
import { STRETCHER_BOND as bond } from '../../common/constants/bonds';
import wallReducer, {
  WallState,
  wallSlice,
  loadWallAsync
} from './wallSlice';
const { buildWall, updateWallCourses } = wallSlice.actions;

describe('wall reducer', () => {
  const initialState: WallState = {
    current: null,
  };

  it('should handle initial state', () => {
    expect(wallReducer(undefined, { type: 'unknown' })).toEqual({
      current: null,
    });
  });

  it('should handle buildWall', () => {
    const actual = wallReducer(initialState, buildWall({
      width: 1000,
      height: 1000,
      brick,
      bond,
    }));
    expect(actual.current).toBeTruthy();
  });

  it('should handle updateWallCourses', () => {
    const wallState = {
      current: {
        id: '1',
        label: 'label',
        brickDimension: {
          id: '2',
          label: 'brick',
          length: 100,
          width: 200,
          height: 300,
        },
        brickPalette: {},
        coursingChart: {
          id: '3',
          brickHeight: 300,
          verticalGauge: [],
        },
        courses: ['HHH', 'SSS'],
      },
    };
    const actual = wallReducer(wallState, updateWallCourses(['XXX', 'YYY']));
    expect(actual.current?.courses).toEqual(['XXX', 'YYY']);
  });

  it('should handle loadWall', () => {
    const wall = {
      id: '1',
      label: 'label',
      brickDimension: {
        id: '2',
        label: 'brick',
        length: 100,
        width: 200,
        height: 300,
      },
      brickPalette: {},
      coursingChart: {
        id: '3',
        brickHeight: 300,
        verticalGauge: [],
      },
      courses: ['HHH', 'SSS'],
    };
    const actual = wallReducer(initialState, {
      type: loadWallAsync.fulfilled,
      payload: wall,
    });
    expect(actual.current).toEqual(wall);
  });
});
