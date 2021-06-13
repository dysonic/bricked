import { nanoid } from '@reduxjs/toolkit'
import { findCoursingChartForBrickHeight, getDeltaHeights, getCourseHeight } from './coursing-chart';
import { BondPattern } from '../constants/bonds';
import { createBrickPalette, getCourseWidth } from './brick-palette';
import { Wall } from '../types/wall';
import { CoursingChart } from '../types/coursing-chart';
import { BrickDimension } from '../types/brick-dimension';
import { Bond } from '../constants/bonds';
import { BrickPalette } from './brick-palette';

export interface Options {
  label?: string;
  brick: BrickDimension;
  bond: Bond;
  height?: number;
  numberOfCourses?: number;
  width?: number;
  repeatPattern?: number;
}

export interface ExtendedOptions extends Options {
  coursingChart: CoursingChart;
  brickPalette: BrickPalette;
}

export interface ExtendedOptionsHeight extends ExtendedOptions {
  height: number;
}

export interface ExtendedOptionsWidth extends ExtendedOptions {
  width: number;
}

export interface ExtendedOptionsBuild extends ExtendedOptions {
  numberOfCourses: number;
  repeatPattern: number;
}

export const buildWall = (options: Options): Wall | null => {
  const { label, brick, bond, height, numberOfCourses, width, repeatPattern } = options;

  const coursingChart: CoursingChart | undefined = findCoursingChartForBrickHeight(brick.height);
  if (!coursingChart) {
    return null;
  }

  const brickPalette = createBrickPalette(brick, bond);

  const wall: Wall = {
    id: nanoid(),
    label: label || bond.label,
    brickDimension: brick,
    brickPalette,
    coursingChart,
    courses: [],
  };

  const extendedOptions: ExtendedOptions = {
    brick,
    bond,
    brickPalette,
    coursingChart,
    height,
    numberOfCourses,
    width,
    repeatPattern,
  };

  if (extendedOptions.height) {
    extendedOptions.numberOfCourses = _calculateNumberOfCourses(extendedOptions as ExtendedOptionsHeight);
  }
  if (extendedOptions.width) {
    extendedOptions.repeatPattern = _calculateRepeatPattern(extendedOptions as ExtendedOptionsWidth);
  }

  wall.courses = _buildWall(extendedOptions as ExtendedOptionsBuild);

  return wall;
};

export const _calculateNumberOfCourses = (options: ExtendedOptionsHeight): number => {
  const { coursingChart, height } = options;
  let i: number = 0;
  let j: number;
  let currentHeight: number = 0;
  let numberOfCourses: number = 0;
  const deltaHeights = getDeltaHeights(coursingChart);
  const dhl = deltaHeights.length;
  while (currentHeight < height) {
    j = i % dhl;
    currentHeight += deltaHeights[j];
    if (currentHeight <= height) {
      numberOfCourses = i + 1;
      i++;
    }
  }
  return numberOfCourses;
};

export const _calculateRepeatPattern = (options: ExtendedOptionsWidth): number => {
  const { width, brickPalette, bond: { pattern: { odd: pattern} } } = options;
  let repeatPattern: number = 0;
  let currentWidth: number = 0;
  let currentRepeatPattern:  number = 0;
  while (currentWidth < width) {
    const course: string = pattern.start + pattern.repeat.repeat(currentRepeatPattern) + pattern.end;
    currentWidth = getCourseWidth(course, brickPalette);
    if (currentWidth <= width) {
      repeatPattern = currentRepeatPattern;
      currentRepeatPattern++;
    }
  }
  return repeatPattern;
};

export const _buildWall = (options: ExtendedOptionsBuild): Array<string> => {
  const { repeatPattern, numberOfCourses } = options;
  const courses: Array<string> = [];

  let oddPattern: boolean = true;
  const getBondPattern = (): BondPattern => {
    const pattern: BondPattern = oddPattern ? options.bond.pattern.odd : options.bond.pattern.even;
    oddPattern = !oddPattern;
    return pattern;
  };

  let brickLetters: string;
  for (let i: number = 0; i < numberOfCourses; i++) {
    const pattern: BondPattern = getBondPattern();
    brickLetters = pattern.start + pattern.repeat.repeat(repeatPattern) + pattern.end;
    courses.push(brickLetters);
  }
  return courses;
};

export const getWallWidth = (wall: Wall): number => {
  const { courses, brickPalette } = wall;
  if (courses.length) {
    return getCourseWidth(courses[0], brickPalette);
  }
  return 0;
}

export const getWallHeight = (wall: Wall): number => {
  const { courses, coursingChart } = wall;
  return getCourseHeight(courses.length, coursingChart);
}
