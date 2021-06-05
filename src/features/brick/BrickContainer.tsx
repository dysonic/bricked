import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BrickForm from './BrickForm';
import IsoBrick from './IsoBrick';
import { selectBrick, brickSlice } from './brickSlice';
import { bricks } from '../../common/constants/bricks';

export const BrickContainer: FC<{}> = () => {
  const { brickDimension } = useSelector(selectBrick);
  const dispatch = useDispatch();

  const handleBrickChange = (brickId: string) => {
    const selectedBrick = bricks.find(b => b.id === brickId);
    if (!selectedBrick) {
      return;
    }
    dispatch(brickSlice.actions.changeBrick(selectedBrick));
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
