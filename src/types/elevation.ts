import { Brick } from './brick';
import { Bond } from '../constants/bonds';
import { BrickPalette } from '../utils/brick-palette';
import { VerticalGaugeMark } from '../constants/coursingCharts';

export interface GenerateOptions {
  brick: Brick;
  bond: Bond;
  height?: number;
  numberOfCourses?: number;
  width?: number;
  repeatPattern?: number;
}

export interface ElevationOptions extends GenerateOptions {
  verticalGauge: Array<VerticalGaugeMark>;
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
