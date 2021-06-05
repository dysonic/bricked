import { BrickDimension } from './brick-dimension';
import { BrickPalette } from '../utils/brick-palette';
import { CoursingChart } from './coursing-chart';

export interface Wall {
  id: string;
  label: string;
  brickDimension: BrickDimension;
  brickPalette: BrickPalette;
  coursingChart: CoursingChart;
  courses: Array<string>;
}
