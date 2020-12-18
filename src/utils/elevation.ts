import { cloneDeep} from 'lodash';
import { Brick } from '../types/brick';
import { getVerticalGauge, VerticalGaugeMark } from '../constants/coursingCharts';

interface GenerateOptions {
  brick: Brick,
  height?: number,
  width?: number,
  numberOfCourses?: number,
  numberOfBricks?: number,
}

export interface Elevation extends GenerateOptions {
  verticalGauge?: Array<VerticalGaugeMark>,
}
export const generate = (options: GenerateOptions) => {
  _validateOptions(options);
  const elevation: Elevation = cloneDeep(options);
  const verticalGauge = getVerticalGauge(options.brick.height);
  if (!verticalGauge) {
    throw new Error(`Vertical gauge not found for brick height ${options.brick.height}`);
  }
  _calculateVertical(elevation, verticalGauge);
  return elevation;
}

const _validateOptions = (options: GenerateOptions) => {
  if (!options.height && !options.numberOfCourses) {
    throw new Error('You must specify either `height` (mm) or `numberOfCourses`');
  }
  if (!options.numberOfBricks && !options.width) {
    throw new Error('You must specify either `width` (mm) or `numberOfBricks`');
  }
};

const _calculateVertical = (elevation: Elevation, verticalGauge: Array<VerticalGaugeMark>) => {
  if (elevation.height) {
    _calculateVerticalUsingElevationHeight(elevation, verticalGauge);
    return;
  }
  _calculateVerticalUsingNumberOfCourses(elevation, verticalGauge);
}

const _calculateVerticalUsingElevationHeight = (elevation: Elevation, verticalGauge: Array<VerticalGaugeMark>) => {
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
      i++;
    }
  } while(currentHeight < elevation.height);
}

const _calculateVerticalUsingNumberOfCourses = (elevation: Elevation, verticalGauge: Array<VerticalGaugeMark>) => {
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
