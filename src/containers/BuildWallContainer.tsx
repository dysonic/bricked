import React, { FC } from 'react';
import { BuildWallForm } from '../components/BuildWallForm';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick } from '../redux/selectors';
import { RootState } from '../redux/types/root-state';
import { bonds, Bond } from '../constants/bonds';
import { Brick } from '../types/brick';

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  return {
    brick,
  };
};

const connector = connect(mapState);

const generateWall = (wallLength:number, wallHeight:number, wallBondId:string) => {
  console.log('wallLength:', wallLength, 'wallHeight:', wallHeight, 'wallBondId:', wallBondId);
};


type PropsFromRedux = ConnectedProps<typeof connector>
const BuildWallContainer: FC<PropsFromRedux> = ({ brick }) => {
  return (
    <div className="build-wall-form-container row">
        <BuildWallForm className="col-md-4" brick={brick} handleSubmit={generateWall}  />
    </div>
  );
}

export default connector(BuildWallContainer);
