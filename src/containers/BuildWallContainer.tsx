import React, { FC } from 'react';
import { isEmpty } from 'lodash';
import { BuildWallForm } from '../components/BuildWallForm';
import { WallTextForm } from '../components/WallTextForm';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick, getWall } from '../redux/selectors';
import { RootState } from '../redux/types/root-state';
import { generateWall } from '../redux/actions';
import { GenerateOptions } from '../utils/elevation';
import { bonds } from '../constants/bonds';

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  const wall = getWall(state);
  return {
    brick,
    wall,
  };
};

const mapDispatch = {
  generateWall,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
const BuildWallContainer: FC<PropsFromRedux> = ({ brick, wall, generateWall }) => {
  const handleSubmit = (wallLength:number, wallHeight:number, wallBondId:string) => {
    console.log('wallLength:', wallLength, 'wallHeight:', wallHeight, 'wallBondId:', wallBondId);
    const bond = bonds.find(b => b.id === wallBondId);
    if (!bond) {
      console.warn('Bond not found');
      return;
    }
    const options: GenerateOptions = {
      width: wallLength,
      height: wallHeight,
      brick,
      bond,
    };
    generateWall(options);
  };
  return (
    <div className="build-wall-form-container row">
      <BuildWallForm className="col-md-4" brick={brick} onSubmit={handleSubmit}  />
      {!isEmpty(wall) && <WallTextForm wall={wall} />}
    </div>
  );
}

export default connector(BuildWallContainer);
