import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Brickwork } from './Brickwork';
import { selectBrick } from './brickSlice';
import { bonds, Bond } from '../../common/constants/bonds';
import { buildWall, Options } from '../../common/utils/wall';
import { BrickDimension } from '../../common/types/brick-dimension';
import { Wall } from '../../common/types/wall';

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
  const { brickDimension } = useSelector(selectBrick);
  const walls = generateWalls(bonds, brickDimension);
  const items = walls.map((wall, i) => <Brickwork key={wall.id} wall={wall} />)
  return (
    <>{items}</>
  );
}
