import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Wall } from '../types/wall';
import { getWallWidth, getWallHeight } from  '../utils/wall';
import { getCourseHeight } from '../utils/coursing-chart';
import { MORTAR_THICKNESS, BRICK_COLOR, MORTAR_COLOR } from '../constants';

const drawBrickAndReturnNewX = (b: string, wall: Wall, x:number, y:number, svgContainer: SVGSVGElement): number => {
  const path = d3.path();
  const width = wall.brickPalette[b];
  path.rect(x, y, width, wall.brickDimension.height);
  d3.select(svgContainer).append('path')
    .style('stroke', 'none')
    .style('fill', BRICK_COLOR)
    .attr('d', path.toString());
  return x + width + MORTAR_THICKNESS;
};

const drawWall = (svgContainer: SVGSVGElement | null, wall: Wall, wallWidth: number, wallHeight: number) => {
  if (!svgContainer) {
    return;
  }

  const { courses, coursingChart } = wall;

  // Draw mortar
  const mortarPath = d3.path();
  mortarPath.rect(0, 0, wallWidth, wallHeight);
  d3.select(svgContainer).append('path')
    .style('stroke', 'none')
    .style('fill', MORTAR_COLOR)
    .attr('d', mortarPath.toString());

  const numberOfCourses = courses.length;
  [...courses].reverse().forEach((course, i) => {
    let x: number = 0;
    const courseHeight = getCourseHeight(numberOfCourses - i, coursingChart);
    const y = wallHeight - courseHeight;
    course.split('').forEach(brickLetter => {
      x = drawBrickAndReturnNewX(brickLetter, wall, x, y, svgContainer);
    });
  });
};


interface WallSvgProps {
  wall: Wall;
};

export const WallSvg: FC<WallSvgProps> = ({ wall }) => {
  const svgEl = useRef(null);
  const { id } = wall;
  const width = getWallWidth(wall);
  const height = getWallHeight(wall);

  useEffect(() => {
    drawWall(svgEl.current, wall, width, height);
  });

  // var svgContainer = d3.select("body").append("svg").attr("width", 200).attr("height", 200);
  return (
    <svg ref={svgEl} id={id} className="wall" width="500" viewBox={`0 0 ${width} ${height}`} />
  );
};


