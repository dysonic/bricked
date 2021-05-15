import React, { FC } from 'react';
import { useHistory } from "react-router-dom";
import { BuildWallForm } from '../components/BuildWallForm';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick, getWall } from '../redux/selectors';
import { RootState } from '../redux/store';
import { buildWall } from '../redux/actions';
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
  buildWall,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
const BuildWallContainer: FC<PropsFromRedux> = ({ brick, wall, buildWall }) => {
  const history = useHistory();

  const handleSubmit = (wallLength:number, wallHeight:number, wallBondId:string) => {
    console.log('wallLength:', wallLength, 'wallHeight:', wallHeight, 'wallBondId:', wallBondId);
    const bond = bonds.find(b => b.id === wallBondId);
    if (!bond) {
      console.warn('Bond not found');
      return;
    }

    buildWall({
      width: wallLength,
      height: wallHeight,
      brick,
      bond,
    });

    history.push('/edit-wall');
  };

  return (
    <div className="build-wall-form-container row">
      <BuildWallForm className="col-md-4" brick={brick} onSubmit={handleSubmit} />
    </div>
  );
}

export default connector(BuildWallContainer);
