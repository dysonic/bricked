interface CoursingChartMap {
  [index: number]: number[],
}
const coursingChartsMap: CoursingChartMap = {
  // brickheight: [ c1Height, c2Height, c3Height, ... ]
  76: [86, 172, 257, 343, 429, 514, 600],
}

export interface VerticalGaugeMark {
  readonly height: number,
  readonly deltaHeight: number,
  readonly mortarThickness: number,
}

export const getVerticalGauge = (brickHeight:number): Array<VerticalGaugeMark> => {
  const verticalGauge = coursingChartsMap[brickHeight];
  return verticalGauge.map((height, i) => {
    const prevHeight = i === 0 ? 0 : verticalGauge[i - 1];
    const deltaHeight = height - prevHeight;
    const mortarThickness = deltaHeight - brickHeight;
    return { height, deltaHeight, mortarThickness };
  });
}
