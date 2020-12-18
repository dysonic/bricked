import React, { FC } from 'react';

const BRICK_HEIGHT = 76;
const VERTICAL_GAUGE = [86, 172, 257, 343, 429, 514, 600];

const getMortarThickness = () => {
  return VERTICAL_GAUGE.map((height, i) => {
    const prevHeight = i === 0 ? 0 : VERTICAL_GAUGE[i - 1];
    return height - prevHeight - BRICK_HEIGHT;
  });
};

const MORTAR_THICKNESS = getMortarThickness();

function CoursingDiagram(props) {
  const mortarThickness = [...MORTAR_THICKNESS].reverse();
  const verticalGauge = [...VERTICAL_GAUGE].reverse();
  const courseLabels = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'].reverse();
  const courses = verticalGauge.map((height, i) =>
    <li>
      <div className="height-label">{height}</div>
      <div className="brick">{courseLabels[i]}</div>
      <div className="mortar-label">{mortarThickness[i]}</div>
    </li>
  );
  return (
    <div className="coursing-diagram">
      <ul>{courses}</ul>
    </div>
  )
}

function CoursingChart(props) {
  return (
    <div className="coursing-chart row">
      <div className="col-md-4">
        <h1>Coursing Chart <small>Seven courses per 600mm</small></h1>
        <p><strong>So how do we achieve a guaranteed constant height?</strong></p>
        <p>The brick layer will adjust the mortar thickness by a millimetre here and there to achieve a uniform 600mm height over each 7 courses.
          So each 7C will equal a height of 600mm and multiples thereof.</p>
      </div>
      <div className="col-md-3">
        <CoursingDiagram />
      </div>
    </div>
  );
}

export default CoursingChart;
