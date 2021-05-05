import React, { FC } from 'react';
import { CoursingChart } from '../types/coursing-chart';
import { VerticalGaugeMark } from '../types/vertical-gauge-mark';
import { getVerticalGauge } from '../utils/coursing-chart';

type CoursingDiagramProps = {
  coursingChart: CoursingChart,
};

const CoursingDiagram: FC<CoursingDiagramProps> = ({ coursingChart }) => {
  const marks: Array<VerticalGaugeMark> = getVerticalGauge(coursingChart);
  const courses = [...marks].reverse().map((mark, i) =>
    <li key={mark.height}>
      <div className="height-label">{mark.height}</div>
      <div className="brick">C{marks.length-i}</div>
      <div className="mortar-label">{mark.mortarThickness}</div>
    </li>
  );
  return (
    <div className="coursing-diagram">
      <ul>{courses}</ul>
    </div>
  )
}

type CoursingChartProps = {
  coursingChart: CoursingChart,
};
export const CoursingChartPage: FC<CoursingChartProps> = ({ coursingChart }) => {
  const { verticalGauge } = coursingChart;
  const vgl = verticalGauge.length;
  const height = verticalGauge[vgl - 1];
  return (
    <div className="coursing-chart row">
      <div className="col-md-4">
        <h1>Coursing Chart <small>{vgl} courses per {height}mm</small></h1>
        <p><strong>So how do we achieve a guaranteed constant height?</strong></p>
        <p>The brick layer will adjust the mortar thickness by a millimetre here and there to achieve a uniform {height}mm height over each {vgl} courses.</p>
        <p>So each {vgl}C will equal a height of {height}mm and multiples thereof.</p>
      </div>
      <div className="col-md-3">
        <CoursingDiagram coursingChart={coursingChart} />
      </div>
    </div>
  );
};
