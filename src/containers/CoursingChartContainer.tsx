import React, { FC } from 'react';
import { CoursingChart } from '../components/CoursingChart';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick } from '../redux/selectors';
import { RootState } from '../redux/types/root-state';
import { getVerticalGauge } from '../constants/coursingCharts';

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  const verticalGauge = getVerticalGauge(brick.height);
  return {
    verticalGauge,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>
const CoursingChartContainer: FC<PropsFromRedux> = ({ verticalGauge }) => {
  return (
    <CoursingChart verticalGauge={verticalGauge} />
  );
}

export default connector(CoursingChartContainer);
