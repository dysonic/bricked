import React, { FC, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Wall } from '../../common/types/wall';
import { getWallWidth, getWallHeight } from  '../../common/utils/wall';
import { getCourseHeight } from '../../common/utils/coursing-chart';
import { MORTAR_THICKNESS, BRICK_COLOR, MORTAR_COLOR } from '../../common/constants';
import { isGap } from '../../common/utils/wall';

/*
const drawBrickAndReturnNewX = (b: string, wall: Wall, x:number, y:number, svgContainer: SVGSVGElement): number => {
  const path = d3.path();
  const brickIsGap = isGap(b);
  const width = wall.brickPalette[b.toUpperCase()];

  if (brickIsGap) {
    const gapX = x - MORTAR_THICKNESS;
    const gapWidth = width + (2 * MORTAR_THICKNESS);
    path.rect(gapX, y, gapWidth, wall.brickDimension.height);
    d3.select(svgContainer).append('path')
      .style('stroke', 'none')
      .style('fill', '#ffffff')
      .attr('d', path.toString());
  } else{
    path.rect(x, y, width, wall.brickDimension.height);
    d3.select(svgContainer).append('path')
      .style('stroke', 'none')
      .style('fill', BRICK_COLOR)
      .attr('d', path.toString());
  }
  return x + width + MORTAR_THICKNESS;
};
*/

const renderWall = (canvas: HTMLCanvasElement | null, wall: Wall, wallWidth: number, wallHeight: number) => {
  if (!canvas) {
    console.log('no canvas!');
    return;
  }

  const { courses, coursingChart } = wall;

  // Renderer
  const renderer = new THREE.WebGLRenderer({canvas});

  // Camera
  const fov = 75; // field-of-view (degrees)
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 2;

  // Scene
  const scene = new THREE.Scene();

  // Box Geometry
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // Material
  const material = new THREE.MeshBasicMaterial({color: BRICK_COLOR});

  // Mesh
  const cube = new THREE.Mesh(geometry, material);

  // Add to scene
  scene.add(cube);

  // Render
  renderer.render(scene, camera);

  // Draw mortar
  // const mortarPath = d3.path();
  // mortarPath.rect(0, 0, wallWidth, wallHeight);
  // d3.select(svgContainer).append('path')
  //   .style('stroke', 'none')
  //   .style('fill', MORTAR_COLOR)
  //   .attr('d', mortarPath.toString());

  // const numberOfCourses = courses.length;
  // [...courses].reverse().forEach((course, i) => {
  //   let x: number = 0;
  //   const courseHeight = getCourseHeight(numberOfCourses - i, coursingChart);
  //   const y = wallHeight - courseHeight;
  //   course.split('').forEach(brickLetter => {
  //     x = drawBrickAndReturnNewX(brickLetter, wall, x, y, svgContainer);
  //   });
  // });
};

interface Wall3DProps {
  wall: Wall;
};

export const Wall3D: FC<Wall3DProps> = ({ wall }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { id } = wall;
  const width = getWallWidth(wall);
  const height = getWallHeight(wall);

  useEffect(() => {
    renderWall(canvasRef.current, wall, width, height);
  });

  return (
    <canvas ref={canvasRef}></canvas>
  );
};
