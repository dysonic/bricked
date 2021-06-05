import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { CoursingChartPage } from './CoursingChartPage';
import { selectBrick } from './brickSlice';

export const CoursingChartContainer: FC<{}> = () => {
  const { brickDimension, coursingChart } = useSelector(selectBrick);
  if (!coursingChart) {
    return <p>There is no coursing chart defined for a brick height of {brickDimension.height}mm.</p>
  }
  return (
    <CoursingChartPage coursingChart={coursingChart} />
  );
}
