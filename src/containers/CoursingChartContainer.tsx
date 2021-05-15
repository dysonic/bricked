import React, { FC } from 'react';
import { useHistory } from "react-router-dom";
import { CoursingChartPage } from '../components/CoursingChartPage';
import { CoursingChart } from '../types/coursing-chart';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick } from '../redux/selectors';
import { RootState } from '../redux/store';
import { findCoursingChartForBrickHeight } from '../utils/coursing-chart';

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  const coursingChart: CoursingChart | undefined = findCoursingChartForBrickHeight(brick.height)
  return {
    coursingChart,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>
const CoursingChartContainer: FC<PropsFromRedux> = ({ coursingChart }) => {
  const history = useHistory();
  if (!coursingChart) {
    history.push('/');
    return null;
  }
  return (
    <CoursingChartPage coursingChart={coursingChart} />
  );
}

export default connector(CoursingChartContainer);
