import { findCoursingChartForBrickHeight, getDeltaHeights } from '../utils/coursing-chart';
import { BondPattern } from '../constants/bonds';
import { createBrickPalette, calculateWidthFromCourse } from './brick-palette';
import {
  GenerateOptions,
  ElevationOptions,
  ElevationOptionsHeight,
  ElevationOptionsNumberOfCourses,
  ElevationOptionsWidth,
  ElevationOptionsRepeatPattern,
  Elevation
} from '../types/elevation';
import { CoursingChart } from '../types/coursing-chart';
import { Course } from '../types/course';
import { createBrick, createCourse } from './factories';

export const generate = (options: GenerateOptions): Elevation | null => {
  const { brick, bond, height, numberOfCourses, width, repeatPattern } = options;

  const coursingChart: CoursingChart | undefined = findCoursingChartForBrickHeight(brick.height);
  if (!coursingChart) {
    return null;
  }

  const brickPalette = createBrickPalette(brick, bond);

  const elevation: Elevation = {
    brickDimension: brick,
    bond,
    height: 0,
    width: 0,
    repeatPattern: 0,
    numberOfCourses: 0,
    brickPalette,
    coursingChart,
    courses: [],
  };

  const elevationOptions: ElevationOptions = {
    brick,
    bond,
    brickPalette,
    coursingChart,
    height,
    numberOfCourses,
    width,
    repeatPattern,
  };

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

  return elevation;
};

export const _calculateVerticalUsingElevationHeight = (elevationOptions: ElevationOptionsHeight, elevation: Elevation): void => {
  const { coursingChart, height } = elevationOptions;
  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  const deltaHeights = getDeltaHeights(coursingChart);
  const dhl = deltaHeights.length;
  while (currentHeight < height) {
    j = i % dhl;
    currentHeight += deltaHeights[j];
    if (currentHeight <= height) {
      elevation.courses.push(createCourse(currentHeight, i+1));
      elevation.height = currentHeight;
      i++;
    }
  }
  elevation.numberOfCourses = elevation.courses.length;
};

export const _calculateVerticalUsingNumberOfCourses = (elevationOptions: ElevationOptionsNumberOfCourses, elevation: Elevation): void => {
  const { coursingChart, numberOfCourses } = elevationOptions;
  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  elevation.numberOfCourses = numberOfCourses;
  const deltaHeights = getDeltaHeights(coursingChart);
  const dhl = deltaHeights.length;
  for (i =0; i < numberOfCourses; i++) {
    j = i % dhl;
    currentHeight += deltaHeights[j];
    elevation.courses.push(createCourse(currentHeight, i+1));
  }
  elevation.height = currentHeight;
};

export const _calculateHorizontalUsingElevationWidth = (elevationOptions: ElevationOptionsWidth, elevation: Elevation): void => {
  _calculateRepeatPatternFromWidth(elevationOptions);
  _calculateHorizontalUsingRepeatPattern(elevationOptions as ElevationOptionsRepeatPattern, elevation);
};

export const _calculateRepeatPatternFromWidth = (elevationOptions: ElevationOptionsWidth) => {
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
};

export const _calculateHorizontalUsingRepeatPattern = (elevationOptions: ElevationOptionsRepeatPattern, elevation: Elevation): void => {
  elevation.repeatPattern = elevationOptions.repeatPattern;

  const { courses } = elevation;

  let oddPattern: boolean = true;
  const getBondPattern = (): BondPattern => {
    const pattern: BondPattern = oddPattern ? elevationOptions.bond.pattern.odd : elevationOptions.bond.pattern.even;
    oddPattern = !oddPattern;
    return pattern;
  };

  let bricksAsText: string = '';
  courses.forEach((course: Course) => {
    const pattern: BondPattern = getBondPattern();
    bricksAsText = pattern.start + pattern.repeat.repeat(elevationOptions.repeatPattern) + pattern.end;
    course.bricks = bricksAsText.split('').map((brickLetter: string) => createBrick(brickLetter));
  });
  elevation.width = calculateWidthFromCourse(bricksAsText, elevationOptions.brickPalette);
};
