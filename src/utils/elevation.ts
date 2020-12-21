import { cloneDeep} from 'lodash';
import { Brick } from '../types/brick';
import { getVerticalGauge, VerticalGaugeMark } from '../constants/coursingCharts';
import { Bond, BondPattern } from '../constants/bonds';
import { createBrickPalette, BrickPalette, calculateWidthFromCourse } from './brick-palette';
export interface GenerateOptions {
  brick: Brick;
  bond: Bond;
  height?: number;
  width?: number;
  numberOfCourses?: number;
  repeatPattern?: number;
}
interface ElevationOptions extends GenerateOptions {
  verticalGauge?: Array<VerticalGaugeMark>;
  brickPalette?: BrickPalette;
  courses?: Array<string>;
}

export interface Elevation {
  brick: Brick;
  bond: Bond;
  height: number;
  width: number;
  numberOfCourses: number;
  brickPalette: BrickPalette;
  verticalGauge: Array<VerticalGaugeMark>;
  courses: Array<string>;
}

export const generate = (options: GenerateOptions): Elevation => {
  _validateOptions(options);

  const elevationOptions: ElevationOptions = cloneDeep(options);
  const verticalGauge = getVerticalGauge(options.brick.height);
  if (!verticalGauge) {
    throw new Error(`Vertical gauge not found for brick height ${options.brick.height}`);
  }

  _calculateVertical(elevationOptions, verticalGauge);
  elevationOptions.brickPalette = createBrickPalette(elevationOptions.brick, elevationOptions.bond);
  _calculateHorizontal(elevationOptions);

  const elevation: Elevation = (elevationOptions as Elevation);
  checkAllCoursesHaveTheSameWidth(elevation);
  return elevation;
}

const _validateOptions = (options: GenerateOptions) => {
  if (!options.height && !options.numberOfCourses) {
    throw new Error('You must specify either `height` (mm) or `numberOfCourses`');
  }
  if (!options.repeatPattern && !options.width) {
    throw new Error('You must specify either `width` (mm) or `repeatPattern`');
  }
};

const _calculateVertical = (elevation: ElevationOptions, verticalGauge: Array<VerticalGaugeMark>) => {
  if (elevation.height) {
    _calculateVerticalUsingElevationHeight(elevation, verticalGauge);
    return;
  }
  _calculateVerticalUsingNumberOfCourses(elevation, verticalGauge);
}

const _calculateVerticalUsingElevationHeight = (elevation: ElevationOptions, verticalGauge: Array<VerticalGaugeMark>) => {
  if (! elevation.height) {
    return;
  }

  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  elevation.verticalGauge = [];
  do {
    j = i % verticalGauge.length;
    currentHeight += verticalGauge[j].deltaHeight;
    if (currentHeight <= elevation.height) {
      elevation.verticalGauge.push({ ...verticalGauge[j], height: currentHeight });
      elevation.numberOfCourses = i;
      i++;
    }
  } while(currentHeight < elevation.height);
}

const _calculateVerticalUsingNumberOfCourses = (elevation: ElevationOptions, verticalGauge: Array<VerticalGaugeMark>) => {
  if (! elevation.numberOfCourses) {
    return;
  }

  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  elevation.verticalGauge = [];
  for (i =0; i < elevation.numberOfCourses; i++) {
    j = i % verticalGauge.length;
    currentHeight += verticalGauge[j].deltaHeight;
    elevation.verticalGauge.push({ ...verticalGauge[j], height: currentHeight });
  }
  elevation.height = currentHeight;
}

const _calculateHorizontal = (elevation: ElevationOptions) => {
  if (elevation.width) {
    _calculateHorizontalUsingElevationWidth(elevation);
    return;
  }
  _calculateHorizontalUsingRepeatPattern(elevation);
}

const _calculateHorizontalUsingElevationWidth = (elevation: ElevationOptions) => {
  if (! elevation.height) {
    return;
  }
}

const _calculateHorizontalUsingRepeatPattern = (elevation: ElevationOptions) => {
  if (! elevation.repeatPattern || ! elevation.verticalGauge || ! elevation.brickPalette) {
    return;
  }

  let i: number = 0;
  elevation.courses = [];
  let width: number = 0;
  for (i =0; i < elevation.verticalGauge.length; i++) {
    const pattern: BondPattern = i % 2 ? elevation.bond.pattern.even: elevation.bond.pattern.odd;
    const course: string = pattern.start + pattern.repeat.repeat(elevation.repeatPattern) + pattern.end;
    width = calculateWidthFromCourse(course, elevation.brickPalette);
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
