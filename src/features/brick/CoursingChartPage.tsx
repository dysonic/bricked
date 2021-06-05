import React, { FC } from 'react';
import { CoursingChart } from '../../common/types/coursing-chart';
import { VerticalGaugeMark } from '../../common/types/vertical-gauge-mark';
import { getVerticalGauge } from '../../common/utils/coursing-chart';

interface CoursingDiagramProps {
  marks: Array<VerticalGaugeMark>;
};

const CoursingDiagram: FC<CoursingDiagramProps> = ({ marks }) => {
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

const determineIfMortarThicknessAdjusted = (marks: Array<VerticalGaugeMark>): boolean => {
  const mortarThicknesses = marks.map(m => m.mortarThickness);
  const minMortarThickness = Math.min(...mortarThicknesses);
  const maxMortarThickness = Math.max(...mortarThicknesses);
  return minMortarThickness !== maxMortarThickness;
};

type CoursingChartProps = {
  coursingChart: CoursingChart,
};
export const CoursingChartPage: FC<CoursingChartProps> = ({ coursingChart }) => {
  const { verticalGauge } = coursingChart;
  const vgl = verticalGauge.length;
  const height = verticalGauge[vgl - 1];
  const marks: Array<VerticalGaugeMark> = getVerticalGauge(coursingChart);
  const isMortarThicknessAdjusted = determineIfMortarThicknessAdjusted(marks);
  return (
    <div className="coursing-chart row">
      <div className="col-md-4">
        <h1>Coursing Chart <small>{vgl} courses per {height}mm</small></h1>
        {isMortarThicknessAdjusted &&
        <div>
        <p><strong>So how do we achieve a guaranteed constant height?</strong></p>
          <p>The brick layer will adjust the mortar thickness by a millimetre here and there to achieve a uniform {height}mm height over each {vgl} courses.</p>
          <p>So each {vgl}C will equal a height of {height}mm and multiples thereof.</p>
        </div>}
      </div>
      <div className="col-md-3">
        <CoursingDiagram marks={marks} />
      </div>
    </div>
  );
};
