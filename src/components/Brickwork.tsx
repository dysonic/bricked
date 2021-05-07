import React, { FC } from 'react';
import { ElevationSvg } from './ElevationSvg';
import { Wall } from '../types/wall';

interface BrickworkProps {
  wall: Wall;
};

export const Brickwork: FC<BrickworkProps> = ({ wall }) => {
  return (
    <div className="brickwork row">
        <div className="col-md-6">
            <h2>{wall.bond.label}</h2>
            <ElevationSvg elevation={wall} />
        </div>
    </div>
  );
};
