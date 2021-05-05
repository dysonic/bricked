import React, { FC } from 'react';
import { Brickwork } from '../components/Brickwork';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick } from '../redux/selectors';
import { RootState } from '../redux/types/root-state';
import { bonds, Bond } from '../constants/bonds';
import { generate } from '../utils/elevation';
import { GenerateOptions } from '../types/elevation';
import { BrickDimension } from '../types/brick-dimension';
import { Elevation } from '../types/elevation';

const generateElevations = (bonds: Array<Bond>, brick: BrickDimension): Array<Elevation> => {
  const elevations: Array<Elevation> = [];
  bonds.forEach((bond: Bond) => {
    const options: GenerateOptions = {
      brick,
      bond,
      numberOfCourses: 4,
      repeatPattern: 2,
    };
    const elevation: Elevation | null = generate(options);
    if (elevation) {
      elevations.push(elevation);
    }
  });
  return elevations;
};

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  return {
    brick,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>
const BrickworkContainer: FC<PropsFromRedux> = ({ brick }) => {
  const elevations = generateElevations(bonds, brick);
  console.log('elevations:', elevations.length);
  console.log(elevations);
  const items = elevations.map(elevation => <Brickwork key={elevation.bond.id} elevation={elevation} />)
  return (
    <>{items}</>
  );
}

export default connector(BrickworkContainer);
