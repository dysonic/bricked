import React from 'react';

function ElevationSvg(props) {
  const { elevation } = props;

  const viewBoxX = Math.ceil(elevation.height);
  const viewBoxY = Math.ceil(1000);

  return (
    <svg className="elevation" viewBox={`0 0 ${viewBoxX} ${viewBoxY}`}>
      {/* <polygon points={outlineStr} fill="none" stroke="black" />
      <line {...line1} stroke="black" />
      <line {...line2} stroke="black" />
      <line {...line3} stroke="black" /> */}
    </svg>
  );
}



export default ElevationSvg;
