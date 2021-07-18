import React, { FC, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Wall3D.scss';
import { Wall } from '../../common/types/wall';
import { getWallWidth, getWallHeight } from  '../../common/utils/wall';
import { getCourseHeight } from '../../common/utils/coursing-chart';
import { MORTAR_THICKNESS, BRICK_COLOR, MORTAR_COLOR } from '../../common/constants';
import { isGap } from '../../common/utils/wall';

interface GetWallGeometryOptions {
  wall: Wall;
  width: number;
  height: number;
  depth: number;
  halfWidth: number;
  halfHeight: number;
}

const createRectShape = (x: number, y: number, width: number, height: number): THREE.Shape => {
  const rect = new THREE.Shape();

  // bottom left corner
  rect.moveTo(x, y);

  rect.lineTo(x, y + height);
  rect.lineTo(x + width, y + height);
  rect.lineTo(x + width, y);
  rect.lineTo(x, y);

  return rect;
}
const getWallGeometry = (options: GetWallGeometryOptions): any => {
  const { wall, width, height, depth, halfWidth, halfHeight } = options;
	// const wallGeometry = new THREE.PlaneGeometry(wallWidth, wallHeight);

  // Wall
  const wallShape = createRectShape(-halfWidth, -halfHeight, width, height);
  // const geometry = new THREE.ShapeGeometry(wallShape);

  // Add brick gaps (holes) to wall
  const gapHeight = wall.brickDimension.height + MORTAR_THICKNESS;
  wall.courses.forEach((course: string, i: number) => {
    const cn: number = i + 1;
    const y: number = getCourseHeight(cn, wall.coursingChart);
    let x: number = 0;
    course.split('').forEach(brickLetter => {
      const brickWidth = wall.brickPalette[brickLetter.toUpperCase()];
      if (isGap(brickLetter)) {
        const gapX = x - MORTAR_THICKNESS;
        const gapY = y - gapHeight;
        const gapWidth = brickWidth + (2 * MORTAR_THICKNESS);
        // console.log(`gap C${cn} - (x,y,w,h): ${gapX}, ${gapY}, ${gapWidth}, ${gapHeight}`);
        const gapShape = createRectShape(-halfWidth+gapX, -halfHeight+gapY, gapWidth, gapHeight);
        wallShape.holes.push(gapShape);
        // const gapGeometry = new THREE.ShapeGeometry(gapShape);
        // geometry.merge(gapGeometry);
      }
      x += brickWidth + MORTAR_THICKNESS;
    });
  });

  // const geometry = new THREE.ShapeGeometry(wallShape);
  const extrudeSettings = {
    bevelEnabled: false,
    depth,
  }
  const geometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings );

  geometry.center();

	return geometry;
}

const calculateCameraZPosition = (fovDegrees: number, halfWallWidth: number, halfWallHeight: number): number => {
  const a = (fovDegrees / 2) * Math.PI / 180;
  const s = 1.2 * halfWallHeight;
  const z = s / Math.tan(a);
  return Math.ceil(z);
};

const renderWall = (canvas: HTMLCanvasElement | null, wall: Wall) => {
  if (!canvas) {
    console.log('no canvas!');
    return;
  }

  const { courses, coursingChart } = wall;
  const width = getWallWidth(wall);
  const height = getWallHeight(wall);
  const depth = wall.brickPalette.S; // double thickness
  console.log(`wall - (width, height, depth):', ${width}, ${height}, ${depth}`);
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;

  // Renderer
  const renderer = new THREE.WebGLRenderer({canvas});

  // Camera
  const fov = 75; // field-of-view (degrees)
  const cameraPositionZ = calculateCameraZPosition(fov, halfWidth, halfHeight);
  console.log('cameraPositionZ:', cameraPositionZ);
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = cameraPositionZ * 2;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // camera.position.z = 2;
  camera.position.z = calculateCameraZPosition(fov, halfWidth, halfHeight);

  // Scene
  const scene = new THREE.Scene();

  // Wall Geometry
  const geometry = getWallGeometry({
    wall,
    width,
    height,
    depth,
    halfWidth,
    halfHeight,
  });

  // Material
  // The `MeshBasicMaterial` is not affected by lights.
  // Use a `MeshPhongMaterial` which is.
  // const material = new THREE.MeshBasicMaterial({color: BRICK_COLOR});
  const material = new THREE.MeshPhongMaterial({color: BRICK_COLOR});

  // Mesh
  const mesh = new THREE.Mesh(geometry, material);

  // Add to scene
  scene.add(mesh);
  // mesh.position.set(-halfWidth, -halfHeight, -halfDepth);

  // Render
  renderer.render(scene, camera);

  // Animate
  const render = (time: number) => {
    time *= 0.001;  // convert time from milliseconds to seconds

    mesh.rotation.x = time; // radians
    mesh.rotation.y = time; // radians

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  // requestAnimationFrame(render);

  // Add light
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
};

interface Wall3DProps {
  wall: Wall;
};

export const Wall3D: FC<Wall3DProps> = ({ wall }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    renderWall(canvasRef.current, wall);
  });

  return (
    <canvas ref={canvasRef} className="wall-3d"></canvas>
  );
};
