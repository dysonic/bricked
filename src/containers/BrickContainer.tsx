import React, { FC } from 'react';
import { Brick } from '../types/brick';
import BrickForm from '../components/BrickForm';
import IsoBrick from '../components/IsoBrick';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick } from '../redux/selectors';
import {
  updateBrickLength,
  updateBrickWidth,
  updateBrickHeight,
} from '../redux/actions';

interface RootState {
  brick: Brick
}

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  return { brick };
};

const mapDispatch = {
  updateBrickLength,
  updateBrickWidth,
  updateBrickHeight,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

export const BrickContainer: FC<PropsFromRedux> = ({ brick, ...actions }) => {
  return (
    <div className="brick-dimensions row">
        <BrickForm className="col-md-4" brick={brick} {...actions} />
        <div className="col-md-2">
            <IsoBrick brick={brick} />
        </div>
    </div>
  );
}

export default connector(BrickContainer);
