import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Wall } from '../types/wall';
import { Course } from '../types/course';
import { Brick } from '../types/brick';
import { MORTAR_THICKNESS, BRICK_COLOR, MORTAR_COLOR } from '../constants';

const drawBrickAndReturnNewX = (b: string, elevation: Wall, x:number, y:number, svgContainer: SVGSVGElement): number => {
  const path = d3.path();
  const width = elevation.brickPalette[b];
  path.rect(x, y, width, elevation.brickDimension.height);
  d3.select(svgContainer).append('path')
    .style('stroke', 'none')
    .style('fill', BRICK_COLOR)
    .attr('d', path.toString());
  return x + width + MORTAR_THICKNESS;
};

const drawElevation = (svgContainer: SVGSVGElement | null, elevation: Wall) => {
  if (!svgContainer) {
    return;
  }

  const { width, height, courses } = elevation;

  // Draw mortar
  const mortarPath = d3.path();
  mortarPath.rect(0, 0, width, height);
  d3.select(svgContainer).append('path')
    .style('stroke', 'none')
    .style('fill', MORTAR_COLOR)
    .attr('d', mortarPath.toString());

  let x: number = 0;
  let y: number = 0;
  const lastCourseIndex: number = courses.length - 1;
  const topHeight = courses[lastCourseIndex].height;

  const drawCourses: Array<Course> = [...courses].reverse();
  drawCourses.forEach((course: Course) => {
    x = 0;
    y = topHeight - course.height;
    course.bricks.forEach((b: Brick) => {
      x = drawBrickAndReturnNewX(b.letter, elevation, x, y, svgContainer);
    });
  });
};


type ElevationSvgProps = {
  elevation: Wall,
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


