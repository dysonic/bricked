import { CoursingChart } from '../types/coursing-chart';

export const STANDARD_BRICK_76: CoursingChart = {
  id: 'standard-brick-76',
  brickHeight: 76,
  verticalGauge: [86, 172, 257, 343, 429, 514, 600],
};

export const MODULAR_BRICK_90: CoursingChart = {
  id: 'modular-brick-90',
  brickHeight: 90,
  verticalGauge: [100, 200, 300, 400, 500, 600],
};

export const coursingCharts: Array<CoursingChart> = [
  STANDARD_BRICK_76,
  MODULAR_BRICK_90,
];
