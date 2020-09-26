import React from 'react';
import Elevation from './Elevation';

function Brickwork(props) {
  const { elevation } = props;
  return (
    <div className="brickwork row">
        <div className="col-md-2">
            <Elevation elevation={elevation} />
        </div>
    </div>
  );
}

export default Brickwork;
