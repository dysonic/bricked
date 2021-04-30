import React, { FC } from 'react';
import { ElevationSvg } from './ElevationSvg';
import { Elevation } from '../types/elevation';

type BrickworkProps = {
  elevation: Elevation,
};
export const Brickwork: FC<BrickworkProps> = ({ elevation }) => {
  return (
    <div className="brickwork row">
        <div className="col-md-6">
            <h2>{elevation.bond.label}</h2>
            <ElevationSvg elevation={elevation} />
        </div>
    </div>
  );
};
