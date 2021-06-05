import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BuildWallForm } from './BuildWallForm';
import { selectBrick } from '../brick/brickSlice';
import { wallSlice } from './wallSlice';
import { bonds } from '../../common/constants/bonds';

export const BuildWallContainer: FC<{}> = () => {
  const history = useHistory();
  const { brickDimension: brick } = useSelector(selectBrick);
  const dispatch = useDispatch();

  const handleSubmit = (wallLength:number, wallHeight:number, wallBondId:string) => {
    console.log('wallLength:', wallLength, 'wallHeight:', wallHeight, 'wallBondId:', wallBondId);
    const bond = bonds.find(b => b.id === wallBondId);
    if (!bond) {
      console.warn('Bond not found');
      return;
    }

    dispatch(wallSlice.actions.buildWall({
      width: wallLength,
      height: wallHeight,
      brick,
      bond,
    }));

    history.push('/edit-wall');
  };

  return (
    <div className="build-wall-form-container row">
      <BuildWallForm className="col-md-4" brick={brick} onSubmit={handleSubmit} />
    </div>
  );
}
