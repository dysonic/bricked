import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Brickwork } from '../components/Brickwork';
import { getBrick } from '../redux/selectors';
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

export const BrickworkContainer: FC<{}> = () => {
  const { brickDimension } = useSelector(getBrick);
  const walls = generateWalls(bonds, brickDimension);
  const items = walls.map((wall, i) => <Brickwork key={wall.id} wall={wall} />)
  return (
    <>{items}</>
  );
}
