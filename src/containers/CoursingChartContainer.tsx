import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { CoursingChartPage } from '../components/CoursingChartPage';
import { getBrick } from '../redux/selectors';

export const CoursingChartContainer: FC<{}> = () => {
  const { brickDimension, coursingChart } = useSelector(getBrick);
  if (!coursingChart) {
    return <p>There is no coursing chart defined for a brick height of {brickDimension.height}mm.</p>
  }
  return (
    <CoursingChartPage coursingChart={coursingChart} />
  );
}
