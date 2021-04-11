import { Brick } from '../types/brick';
import { getVerticalGauge, VerticalGaugeMark } from '../constants/coursingCharts';
import { Bond, BondPattern } from '../constants/bonds';
import { createBrickPalette, BrickPalette, calculateWidthFromCourse } from './brick-palette';

export interface GenerateOptions {
  brick: Brick;
  bond: Bond;
  height?: number;
  numberOfCourses?: number;
  width?: number;
  repeatPattern?: number;
}

interface ElevationOptions extends GenerateOptions {
  verticalGauge: Array<VerticalGaugeMark>;
  brickPalette: BrickPalette;
}

interface ElevationOptionsHeight extends ElevationOptions {
  height: number;
}

interface ElevationOptionsNumberOfCourses extends ElevationOptions {
  numberOfCourses: number;
}

interface ElevationOptionsWidth extends ElevationOptions {
  width: number;
}

interface ElevationOptionsRepeatPattern extends ElevationOptions {
  repeatPattern: number;
}

export interface Elevation {
  brick: Brick;
  bond: Bond;
  height: number;
  width: number;
  numberOfCourses: number;
  repeatPattern: number;
  brickPalette: BrickPalette;
  verticalGauge: Array<VerticalGaugeMark>;
  courses: Array<string>;
}

export const generate = (options: GenerateOptions): Elevation => {
  const { brick, bond, height, numberOfCourses, width, repeatPattern } = options;
  const brickPalette = createBrickPalette(brick, bond);

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

  const elevationOptions: ElevationOptions = {
    brick,
    bond,
    verticalGauge: [],
    brickPalette,
    height,
    numberOfCourses,
    width,
    repeatPattern,
  };

  // const elevationOptions: ElevationOptions = cloneDeep(options);
  if (!_getVerticalGauge(elevationOptions)) {
    return elevation;
  }

  elevationOptions.brickPalette = createBrickPalette(elevationOptions.brick, elevationOptions.bond);

  if (elevationOptions.height) {
    _calculateVerticalUsingElevationHeight(elevationOptions as ElevationOptionsHeight, elevation);
  }
  if (elevationOptions.numberOfCourses) {
    _calculateVerticalUsingNumberOfCourses(elevationOptions as ElevationOptionsNumberOfCourses, elevation);
  }
  if (elevationOptions.width) {
    _calculateHorizontalUsingElevationWidth(elevationOptions as ElevationOptionsWidth, elevation);
  }
  if (elevationOptions.repeatPattern) {
    _calculateHorizontalUsingRepeatPattern(elevationOptions as ElevationOptionsRepeatPattern, elevation);
  }

  // checkAllCoursesHaveTheSameWidth(elevation);

  return elevation;
}

const _getVerticalGauge = (elevationOptions: ElevationOptions): boolean => {
  elevationOptions.verticalGauge = getVerticalGauge(elevationOptions.brick.height);
  if (!elevationOptions.verticalGauge) {
    console.warn(`Vertical gauge not found for brick height ${elevationOptions.brick.height}`);
    return false;
  }
  return true;
}

const _calculateVerticalUsingElevationHeight = (elevationOptions: ElevationOptionsHeight, elevation: Elevation) => {
  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  do {
    j = i % elevationOptions.verticalGauge.length;
    currentHeight += elevationOptions.verticalGauge[j].deltaHeight;
    if (currentHeight <= elevationOptions.height) {
      elevation.verticalGauge.push({ ...elevationOptions.verticalGauge[j], height: currentHeight });
      elevation.numberOfCourses = i;
      elevation.height = currentHeight;
      i++;
    }
  } while(currentHeight < elevationOptions.height);
}

const _calculateVerticalUsingNumberOfCourses = (elevationOptions: ElevationOptionsNumberOfCourses, elevation: Elevation) => {
  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  elevation.numberOfCourses = elevationOptions.numberOfCourses;
  for (i =0; i < elevationOptions.numberOfCourses; i++) {
    j = i % elevationOptions.verticalGauge.length;
    currentHeight += elevationOptions.verticalGauge[j].deltaHeight;
    elevation.verticalGauge.push({ ...elevationOptions.verticalGauge[j], height: currentHeight });
  }
  elevation.height = currentHeight;
}

const _calculateHorizontalUsingElevationWidth = (elevationOptions: ElevationOptionsWidth, elevation: Elevation) => {
  _calculateRepeatPatternFromWidth(elevationOptions);
  _calculateHorizontalUsingRepeatPattern(elevationOptions as ElevationOptionsRepeatPattern, elevation);
}

const _calculateRepeatPatternFromWidth = (elevationOptions: ElevationOptionsWidth) => {
  let repeatPattern: number = 0;
  let currentWidth: number = 0;
  const pattern: BondPattern = elevationOptions.bond.pattern.odd;
  do {
    const course: string = pattern.start + pattern.repeat.repeat(repeatPattern) + pattern.end;
    currentWidth = calculateWidthFromCourse(course, elevationOptions.brickPalette);
    if (currentWidth <= elevationOptions.width) {
      elevationOptions.repeatPattern = repeatPattern;
      repeatPattern++;
    }
  } while(currentWidth < elevationOptions.width);
}

const _calculateHorizontalUsingRepeatPattern = (elevationOptions: ElevationOptionsRepeatPattern, elevation: Elevation) => {
  elevation.repeatPattern = elevationOptions.repeatPattern;
  let i: number = 0;
  let width: number = 0;
  for (i =0; i < elevationOptions.verticalGauge.length; i++) {
    const pattern: BondPattern = i % 2 ? elevationOptions.bond.pattern.even: elevationOptions.bond.pattern.odd;
    const course: string = pattern.start + pattern.repeat.repeat(elevationOptions.repeatPattern) + pattern.end;
    width = calculateWidthFromCourse(course, elevationOptions.brickPalette);
    elevation.courses.push(course);
  }
  elevation.width = width;
}

const checkAllCoursesHaveTheSameWidth = (elevation: Elevation) => {
  const widths = elevation.courses.map(c => {
    return calculateWidthFromCourse(c, elevation.brickPalette);
  });
  if (!widths.every(width => width === elevation.width)) {
    throw new Error('Not all course widths are the same');
  }
};
