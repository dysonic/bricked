import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Elevation } from '../utils/elevation';
import { MORTAR_THICKNESS, BRICK_COLOR, MORTAR_COLOR } from '../constants';

const drawBrickAndReturnNewX = (b: string, elevation: Elevation, x:number, y:number, svgContainer: SVGSVGElement): number => {
  const path = d3.path();
  const width = elevation.brickPalette[b];
  path.rect(x, y, width, elevation.brick.height);
  d3.select(svgContainer).append('path')
    .style('stroke', 'none')
    .style('fill', BRICK_COLOR)
    .attr('d', path.toString());
  return x + width + MORTAR_THICKNESS;
};

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

  let c: number = elevation.numberOfCourses - 1;
  let y: number = 0;
  while (c >= 0) {
    let x:number = 0;
    const bricks: Array<string> = elevation.courses[c].split('');
    bricks.forEach((b: string) => {
      x = drawBrickAndReturnNewX(b, elevation, x, y, svgContainer);
    });

    y = y + elevation.verticalGauge[c].deltaHeight;

    // i = 0;
    c--;
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
    <svg ref={svgEl} id={elevation.bond.id} className="elevation" width="500" viewBox={`0 0 ${elevation.width} ${elevation.height}`} />
  );
};


