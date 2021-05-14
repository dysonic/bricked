import React, { FC } from 'react';
import { Brickwork } from '../components/Brickwork';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick } from '../redux/selectors';
import { RootState } from '../redux/types/root-state';
import { bonds, Bond } from '../constants/bonds';
import { buildWall, Options } from '../utils/wall';
import { BrickDimension } from '../types/brick-dimension';
import { Wall } from '../types/wall';

const generateWalls = (bonds: Array<Bond>, brick: BrickDimension): Array<Wall> => {
  const walls: Array<Wall> = [];
  bonds.forEach((bond: Bond) => {
    const options: Options = {
      brick,
      bond,
      numberOfCourses: 4,
      repeatPattern: 2,
    };
    const elevation: Wall | null = buildWall(options);
    if (elevation) {
      walls.push(elevation);
    }
  });
  return walls;
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
  const walls = generateWalls(bonds, brick);
  const items = walls.map((wall, i) => <Brickwork key={wall.id} wall={wall} />)
  return (
    <>{items}</>
  );
}

export default connector(BrickworkContainer);
