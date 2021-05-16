import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BuildWallForm } from '../components/BuildWallForm';
import { getBrick, getWall } from '../redux/selectors';
import { buildWall } from '../redux/actions';
import { bonds } from '../constants/bonds';

// const mapState = (state: RootState) => {
//   const brick = getBrick(state);
//   const wall = getWall(state);
//   return {
//     brick,
//     wall,
//   };
// };

// const mapDispatch = {
//   buildWall,
// };

export const BuildWallContainer: FC<{}> = () => {
  const history = useHistory();
  const brick = useSelector(getBrick);
  const dispatch = useDispatch();

  const handleSubmit = (wallLength:number, wallHeight:number, wallBondId:string) => {
    console.log('wallLength:', wallLength, 'wallHeight:', wallHeight, 'wallBondId:', wallBondId);
    const bond = bonds.find(b => b.id === wallBondId);
    if (!bond) {
      console.warn('Bond not found');
      return;
    }

    dispatch(buildWall({
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
