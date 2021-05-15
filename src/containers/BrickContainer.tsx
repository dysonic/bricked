import React, { FC } from 'react';
import BrickForm from '../components/BrickForm';
import IsoBrick from '../components/IsoBrick';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick } from '../redux/selectors';
import { RootState } from '../redux/store';
import { setBrick } from '../redux/actions';
import { bricks } from '../constants/bricks';

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  return { brick };
};

const mapDispatch = {
  setBrick,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
const BrickContainer: FC<PropsFromRedux> = ({ brick, setBrick }) => {
  console.log(`BrickContainer - brick: ${brick.id}`);
  return (
    <div className="brick-dimensions row">
      <div className="brick-form col-sm-4">
        <BrickForm brick={brick} bricks={bricks} setBrick={setBrick} />
      </div>
        <div className="col-sm-2">
          <IsoBrick brick={brick} />
        </div>
    </div>
  );
}

export default connector(BrickContainer);
