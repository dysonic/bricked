import React, { FC } from 'react';
import { VerticalGaugeMark } from '../constants/coursingCharts';

type CoursingDiagramProps = {
  verticalGauge: Array<VerticalGaugeMark>,
};
const CoursingDiagram: FC<CoursingDiagramProps> = ({ verticalGauge }) => {
  const courses = [...verticalGauge].reverse().map((mark, i) =>
    <li>
      <div className="height-label">{mark.height}</div>
      <div className="brick">C{verticalGauge.length-i}</div>
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
  verticalGauge: Array<VerticalGaugeMark>,
};
export const CoursingChart: FC<CoursingChartProps> = ({ verticalGauge }) => {
  const numberOfCourses = verticalGauge.length;
  const height = verticalGauge[numberOfCourses - 1].height;
  return (
    <div className="coursing-chart row">
      <div className="col-md-4">
        <h1>Coursing Chart <small>{numberOfCourses} courses per {height}mm</small></h1>
        <p><strong>So how do we achieve a guaranteed constant height?</strong></p>
        <p>The brick layer will adjust the mortar thickness by a millimetre here and there to achieve a uniform {height}mm height over each {numberOfCourses} courses.</p>
        <p>So each {numberOfCourses}C will equal a height of {height}mm and multiples thereof.</p>
      </div>
      <div className="col-md-3">
        <CoursingDiagram verticalGauge={verticalGauge} />
      </div>
    </div>
  );
};
