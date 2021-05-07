import { BrickDimension } from './brick-dimension';
import { Bond } from '../constants/bonds';
import { BrickPalette } from '../utils/brick-palette';
import { CoursingChart } from './coursing-chart';
import { Course } from './course';

export interface GenerateWallOptions {
  brick: BrickDimension;
  bond: Bond;
  height?: number;
  numberOfCourses?: number;
  width?: number;
  repeatPattern?: number;
}

export interface WallOptions extends GenerateWallOptions {
  coursingChart: CoursingChart;
  brickPalette: BrickPalette;
}

export interface WallOptionsHeight extends WallOptions {
  height: number;
}

export interface WallOptionsNumberOfCourses extends WallOptions {
  numberOfCourses: number;
}

export interface WallOptionsWidth extends WallOptions {
  width: number;
}

export interface WallOptionsRepeatPattern extends WallOptions {
  repeatPattern: number;
}

export interface Wall {
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
