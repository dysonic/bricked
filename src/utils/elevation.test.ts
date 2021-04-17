import {
  _calculateVerticalUsingElevationHeight,
  _calculateVerticalUsingNumberOfCourses,
  _calculateHorizontalUsingRepeatPattern,
  _calculateHorizontalUsingElevationWidth,
  ElevationOptionsHeight,
  ElevationOptionsNumberOfCourses,
  ElevationOptionsRepeatPattern,
  ElevationOptionsWidth,
  Elevation,
} from './elevation'
import { Brick } from '../types/brick';
import { BrickPalette, calculateWidthFromCourse } from './brick-palette';
import { DOUBLE_FLEMISH_BOND as bond } from '../constants/bonds';
import { getVerticalGauge } from '../constants/coursingCharts';

const brick: Brick = {
  width: 110,
  length: 230,
  height: 76,
}

const brickPalette: BrickPalette = {
  h: 110,
  s: 230,
  q: 50,
};

const createElevation = (): Elevation => {
  return {
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
};

const expectAllElevationCoursesHaveTheSameWidth = (elevation: Elevation) => {
  const widths = elevation.courses.map(c => {
    return calculateWidthFromCourse(c, elevation.brickPalette);
  });
  const allTheSame = widths.every(width => width === elevation.width);
  expect(allTheSame).toBe(true);
};

test('_calculateVerticalUsingNumberOfCourses function', () => {
  const elevationOptions:ElevationOptionsNumberOfCourses = {
    brick,
    bond,
    verticalGauge: getVerticalGauge(brick.height),
    brickPalette,
    numberOfCourses: 14,
  };

  const elevation = createElevation();

  _calculateVerticalUsingNumberOfCourses(elevationOptions, elevation);

  expect(elevation.height).toBe(1200);
  expect(elevation.numberOfCourses).toBe(14);
  expect(elevation.verticalGauge.length).toBe(14);
  expect(elevation.verticalGauge).toEqual([
    { deltaHeight: 86, height: 86, mortarThickness: 10 },
    { deltaHeight: 86, height: 172, mortarThickness: 10 },
    { deltaHeight: 85, height: 257, mortarThickness: 9 },
    { deltaHeight: 86, height: 343, mortarThickness: 10 },
    { deltaHeight: 86, height: 429, mortarThickness: 10 },
    { deltaHeight: 85, height: 514, mortarThickness: 9 },
    { deltaHeight: 86, height: 600, mortarThickness: 10 },
    { deltaHeight: 86, height: 686, mortarThickness: 10 },
    { deltaHeight: 86, height: 772, mortarThickness: 10 },
    { deltaHeight: 85, height: 857, mortarThickness: 9 },
    { deltaHeight: 86, height: 943, mortarThickness: 10 },
    { deltaHeight: 86, height: 1029, mortarThickness: 10 },
    { deltaHeight: 85, height: 1114, mortarThickness: 9 },
    { deltaHeight: 86, height: 1200, mortarThickness: 10 },
  ]);
});

test('_calculateVerticalUsingElevationHeight function', () => {
  const elevationOptions:ElevationOptionsHeight = {
    brick,
    bond,
    verticalGauge: getVerticalGauge(brick.height),
    brickPalette,
    height: 1000,
  };

  const elevation = createElevation();

  _calculateVerticalUsingElevationHeight(elevationOptions, elevation);

  expect(elevation.height).toBe(943);
  expect(elevation.numberOfCourses).toBe(11);
  expect(elevation.verticalGauge.length).toBe(11);
  expect(elevation.verticalGauge).toEqual([
    { deltaHeight: 86, height: 86, mortarThickness: 10 },
    { deltaHeight: 86, height: 172, mortarThickness: 10 },
    { deltaHeight: 85, height: 257, mortarThickness: 9 },
    { deltaHeight: 86, height: 343, mortarThickness: 10 },
    { deltaHeight: 86, height: 429, mortarThickness: 10 },
    { deltaHeight: 85, height: 514, mortarThickness: 9 },
    { deltaHeight: 86, height: 600, mortarThickness: 10 },
    { deltaHeight: 86, height: 686, mortarThickness: 10 },
    { deltaHeight: 86, height: 772, mortarThickness: 10 },
    { deltaHeight: 85, height: 857, mortarThickness: 9 },
    { deltaHeight: 86, height: 943, mortarThickness: 10 },
  ]);
});

test('_calculateHorizontalUsingRepeatPattern function', () => {
  const elevationOptions:ElevationOptionsRepeatPattern = {
    brick,
    bond,
    verticalGauge: getVerticalGauge(brick.height),
    brickPalette,
    height: 1000,
    repeatPattern: 2,
  };

  const elevation = createElevation();
  elevation.height = 943;
  elevation.numberOfCourses = 11;
  elevation.verticalGauge = [
    { deltaHeight: 86, height: 86, mortarThickness: 10 },
    { deltaHeight: 86, height: 172, mortarThickness: 10 },
    { deltaHeight: 85, height: 257, mortarThickness: 9 },
    { deltaHeight: 86, height: 343, mortarThickness: 10 },
    { deltaHeight: 86, height: 429, mortarThickness: 10 },
    { deltaHeight: 85, height: 514, mortarThickness: 9 },
    { deltaHeight: 86, height: 600, mortarThickness: 10 },
    { deltaHeight: 86, height: 686, mortarThickness: 10 },
    { deltaHeight: 86, height: 772, mortarThickness: 10 },
    { deltaHeight: 85, height: 857, mortarThickness: 9 },
    { deltaHeight: 86, height: 943, mortarThickness: 10 },
  ];


  _calculateHorizontalUsingRepeatPattern(elevationOptions, elevation);

  expect(elevation.courses.length).toBe(11);
  expect(elevation.courses).toEqual([
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
  ]);
  expect(elevation.width).toBe(1310);

  expectAllElevationCoursesHaveTheSameWidth(elevation);
});


test('_calculateHorizontalUsingElevationWidth function', () => {
  const elevationOptions:ElevationOptionsWidth = {
    brick,
    bond,
    verticalGauge: getVerticalGauge(brick.height),
    brickPalette,
    height: 1000,
    width: 1000,
  };

  const elevation = createElevation();
  elevation.height = 943;
  elevation.numberOfCourses = 11;
  elevation.verticalGauge = [
    { deltaHeight: 86, height: 86, mortarThickness: 10 },
    { deltaHeight: 86, height: 172, mortarThickness: 10 },
    { deltaHeight: 85, height: 257, mortarThickness: 9 },
    { deltaHeight: 86, height: 343, mortarThickness: 10 },
    { deltaHeight: 86, height: 429, mortarThickness: 10 },
    { deltaHeight: 85, height: 514, mortarThickness: 9 },
    { deltaHeight: 86, height: 600, mortarThickness: 10 },
    { deltaHeight: 86, height: 686, mortarThickness: 10 },
    { deltaHeight: 86, height: 772, mortarThickness: 10 },
    { deltaHeight: 85, height: 857, mortarThickness: 9 },
    { deltaHeight: 86, height: 943, mortarThickness: 10 },
  ];


  _calculateHorizontalUsingElevationWidth(elevationOptions, elevation);

  expect(elevation.courses.length).toBe(11);
  expect(elevation.courses).toEqual([
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
    'hqshshsqh',
    'shshshs',
  ]);
  expect(elevation.width).toBe(1310);

  expectAllElevationCoursesHaveTheSameWidth(elevation);
});