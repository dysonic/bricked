const coursingCharts = {
  // brickheight: [ c1Height, c2Height, c3Height, ... ]
  '76': [86, 172, 257, 343, 429, 514, 600],
}

export default coursingCharts;

export const getEnhancedCoursingChart = brickHeight => {
  const verticalGauge = coursingCharts[brickHeight];
  return verticalGauge.map((height, i) => {
    const prevHeight = i === 0 ? 0 : verticalGauge[i - 1];
    const delta = height - prevHeight;
    const mortarThickness = delta - brickHeight;
    return { height, delta, mortarThickness };
  });
}
