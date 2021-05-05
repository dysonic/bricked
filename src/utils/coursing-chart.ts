import { CoursingChart } from '../types/coursing-chart';
import { VerticalGaugeMark } from '../types/vertical-gauge-mark';
import { coursingCharts } from '../constants/coursing-charts';

export const findCoursingChartForBrickHeight = (brickHeight: number): CoursingChart | undefined => {
  return coursingCharts.find((cc: CoursingChart) => cc.brickHeight === brickHeight);
}

export const getCourseHeight = (courseNumber: number, coursingChart: CoursingChart): number => {
  const { verticalGauge } = coursingChart;
  const i = courseNumber - 1;
  const vgl = verticalGauge.length;
  const multipler = Math.floor(i / vgl);
  const topHeight = verticalGauge[vgl - 1];
  const j = i % vgl;
  const courseHeight = (multipler * topHeight) + verticalGauge[j];
  return courseHeight;
};

export const getDeltaHeights = (coursingChart: CoursingChart): Array<number> => {
  const { verticalGauge } = coursingChart;
  return verticalGauge.map((height: number, i) => {
    const prevHeight = i === 0 ? 0 : verticalGauge[i - 1];
    const deltaHeight = height - prevHeight;
    return deltaHeight;
  });
}

export const getVerticalGauge = (coursingChart: CoursingChart): Array<VerticalGaugeMark> => {
  const { brickHeight } = coursingChart;
  const deltaHeights = getDeltaHeights(coursingChart);
  let height: number = 0;
  return deltaHeights.map((deltaHeight: number) => {
    const mortarThickness = deltaHeight - brickHeight;
    height += deltaHeight;
    return { height, deltaHeight, mortarThickness };
  });
}
