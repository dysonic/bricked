import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BrickForm from '../components/BrickForm';
import IsoBrick from '../components/IsoBrick';
import { getBrick } from '../redux/selectors';
import { changeBrick } from '../redux/actions';
import { bricks } from '../constants/bricks';

export const BrickContainer: FC<{}> = () => {
  const { brickDimension } = useSelector(getBrick);
  const dispatch = useDispatch();

  const handleBrickChange = (brickId: string) => {
    const selectedBrick = bricks.find(b => b.id === brickId);
    if (!selectedBrick) {
      return;
    }
    dispatch(changeBrick(selectedBrick));
  };

  return (
    <div className="brick-dimensions row">
      <div className="brick-form col-sm-4">
        <BrickForm brick={brickDimension} bricks={bricks} handleBrickChange={handleBrickChange} />
      </div>
        <div className="col-sm-2">
          <IsoBrick brick={brickDimension} />
        </div>
    </div>
  );
}
