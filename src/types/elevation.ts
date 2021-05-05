import { BrickDimension } from './brick-dimension';
import { Bond } from '../constants/bonds';
import { BrickPalette } from '../utils/brick-palette';
import { CoursingChart } from '../types/coursing-chart';
import { Course } from './course';

export interface GenerateOptions {
  brick: BrickDimension;
  bond: Bond;
  height?: number;
  numberOfCourses?: number;
  width?: number;
  repeatPattern?: number;
}

export interface ElevationOptions extends GenerateOptions {
  coursingChart: CoursingChart;
  brickPalette: BrickPalette;
}

export interface ElevationOptionsHeight extends ElevationOptions {
  height: number;
}

export interface ElevationOptionsNumberOfCourses extends ElevationOptions {
  numberOfCourses: number;
}

export interface ElevationOptionsWidth extends ElevationOptions {
  width: number;
}

export interface ElevationOptionsRepeatPattern extends ElevationOptions {
  repeatPattern: number;
}

export interface Elevation {
  brickDimension: BrickDimension;
  bond: Bond;
  height: number;
  width: number;
  numberOfCourses: number;
  repeatPattern: number;
  brickPalette: BrickPalette;
  coursingChart: CoursingChart;
  courses: Array<Course>;
}
