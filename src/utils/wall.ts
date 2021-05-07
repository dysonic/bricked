import { findCoursingChartForBrickHeight, getDeltaHeights } from './coursing-chart';
import { BondPattern } from '../constants/bonds';
import { createBrickPalette, calculateWidthFromCourse } from './brick-palette';
import {
  GenerateWallOptions,
  WallOptions,
  WallOptionsHeight,
  WallOptionsNumberOfCourses,
  WallOptionsWidth,
  WallOptionsRepeatPattern,
  Wall
} from '../types/wall';
import { CoursingChart } from '../types/coursing-chart';
import { Course } from '../types/course';
import { createBrick, createCourse } from './factories';

export const generate = (options: GenerateWallOptions): Wall | null => {
  const { brick, bond, height, numberOfCourses, width, repeatPattern } = options;

  const coursingChart: CoursingChart | undefined = findCoursingChartForBrickHeight(brick.height);
  if (!coursingChart) {
    return null;
  }

  const brickPalette = createBrickPalette(brick, bond);

  const wall: Wall = {
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

  const wallOptions: WallOptions = {
    brick,
    bond,
    brickPalette,
    coursingChart,
    height,
    numberOfCourses,
    width,
    repeatPattern,
  };

  if (wallOptions.height) {
    _calculateVerticalUsingHeight(wallOptions as WallOptionsHeight, wall);
  }
  if (wallOptions.numberOfCourses) {
    _calculateVerticalUsingNumberOfCourses(wallOptions as WallOptionsNumberOfCourses, wall);
  }
  if (wallOptions.width) {
    _calculateHorizontalUsingWidth(wallOptions as WallOptionsWidth, wall);
  }
  if (wallOptions.repeatPattern) {
    _calculateHorizontalUsingRepeatPattern(wallOptions as WallOptionsRepeatPattern, wall);
  }

  return wall;
};

export const _calculateVerticalUsingHeight = (options: WallOptionsHeight, wall: Wall): void => {
  const { coursingChart, height } = options;
  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  const deltaHeights = getDeltaHeights(coursingChart);
  const dhl = deltaHeights.length;
  while (currentHeight < height) {
    j = i % dhl;
    currentHeight += deltaHeights[j];
    if (currentHeight <= height) {
      wall.courses.push(createCourse(currentHeight, i+1));
      wall.height = currentHeight;
      i++;
    }
  }
  wall.numberOfCourses = wall.courses.length;
};

export const _calculateVerticalUsingNumberOfCourses = (options: WallOptionsNumberOfCourses, wall: Wall): void => {
  const { coursingChart, numberOfCourses } = options;
  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  wall.numberOfCourses = numberOfCourses;
  const deltaHeights = getDeltaHeights(coursingChart);
  const dhl = deltaHeights.length;
  for (i =0; i < numberOfCourses; i++) {
    j = i % dhl;
    currentHeight += deltaHeights[j];
    wall.courses.push(createCourse(currentHeight, i+1));
  }
  wall.height = currentHeight;
};

export const _calculateHorizontalUsingWidth = (options: WallOptionsWidth, wall: Wall): void => {
  _calculateRepeatPatternFromWidth(options);
  _calculateHorizontalUsingRepeatPattern(options as WallOptionsRepeatPattern, wall);
};

export const _calculateRepeatPatternFromWidth = (options: WallOptionsWidth) => {
  let repeatPattern: number = 0;
  let currentWidth: number = 0;
  const pattern: BondPattern = options.bond.pattern.odd;
  do {
    const course: string = pattern.start + pattern.repeat.repeat(repeatPattern) + pattern.end;
    currentWidth = calculateWidthFromCourse(course, options.brickPalette);
    if (currentWidth <= options.width) {
      options.repeatPattern = repeatPattern;
      repeatPattern++;
    }
  } while(currentWidth < options.width);
};

export const _calculateHorizontalUsingRepeatPattern = (options: WallOptionsRepeatPattern, wall: Wall): void => {
  wall.repeatPattern = options.repeatPattern;

  const { courses } = wall;

  let oddPattern: boolean = true;
  const getBondPattern = (): BondPattern => {
    const pattern: BondPattern = oddPattern ? options.bond.pattern.odd : options.bond.pattern.even;
    oddPattern = !oddPattern;
    return pattern;
  };

  let bricksAsText: string = '';
  courses.forEach((course: Course) => {
    const pattern: BondPattern = getBondPattern();
    bricksAsText = pattern.start + pattern.repeat.repeat(options.repeatPattern) + pattern.end;
    course.bricks = bricksAsText.split('').map((brickLetter: string) => createBrick(brickLetter));
  });
  wall.width = calculateWidthFromCourse(bricksAsText, options.brickPalette);
};
