import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CoursingChartPage } from '../components/CoursingChartPage';
import { CoursingChart } from '../types/coursing-chart';
import { getBrick } from '../redux/selectors';

import { findCoursingChartForBrickHeight } from '../utils/coursing-chart';

export const CoursingChartContainer: FC<{}> = () => {
  const history = useHistory();
  const brick = useSelector(getBrick);
  const coursingChart: CoursingChart | undefined = findCoursingChartForBrickHeight(brick.height);
  if (!coursingChart) {
    history.push('/');
    return null;
  }
  return (
    <CoursingChartPage coursingChart={coursingChart} />
  );
}
