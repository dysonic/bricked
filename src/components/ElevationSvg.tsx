import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Elevation } from '../utils/elevation';
import { MORTAR_THICKNESS, BRICK_COLOR, MORTAR_COLOR } from '../constants';

const drawElevation = (svgContainer: SVGSVGElement | null, elevation: Elevation) => {
  if (!svgContainer) {
    return;
  }

  // Draw mortar
  const mortarPath = d3.path();
  mortarPath.rect(0, 0, elevation.width, elevation.height);
  d3.select(svgContainer).append('path')
    .style('stroke', 'none')
    .style('fill', MORTAR_COLOR)
    .attr('d', mortarPath.toString());

  let i: number = elevation.numberOfCourses - 1;
  let y: number = 0;
  while (i >= 0) {
    let x:number = 0;
    const bricks: Array<string> = elevation.courses[i].split('');
    // const rectangle: HTMLElement = svgContainer.append('rect').attr("x", 10)
    //   .attr("y", 10)
    //   .attr("width", 50)
    //   .attr("height", 100);
    bricks.forEach((b: string) => {
      const path = d3.path();
      const width = elevation.brickPalette[b];
      path.rect(x, y, width, elevation.brick.height);
      d3.select(svgContainer).append('path')
        .style('stroke', 'none')
        .style('fill', BRICK_COLOR)
        .attr('d', path.toString());
      x = x + width + MORTAR_THICKNESS;
    });

    y = y + elevation.verticalGauge[i].deltaHeight;

    // i = 0;
    i--;
  }
};


type ElevationSvgProps = {
  elevation: Elevation,
};
export const ElevationSvg: FC<ElevationSvgProps> = ({ elevation }) => {
  const svgEl = useRef(null);

  useEffect(() => {
    drawElevation(svgEl.current, elevation);
  });

  // var svgContainer = d3.select("body").append("svg").attr("width", 200).attr("height", 200);
  return (
    <svg ref={svgEl} id={elevation.bond.id} className="elevation" width={elevation.width} height={elevation.height} />
  );
};


