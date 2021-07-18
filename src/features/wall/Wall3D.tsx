import React, { FC, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Wall3D.scss';
import { Wall } from '../../common/types/wall';
import { getWallWidth, getWallHeight } from  '../../common/utils/wall';
import { getCourseHeight } from '../../common/utils/coursing-chart';
import { MORTAR_THICKNESS, BRICK_COLOR, MORTAR_COLOR } from '../../common/constants';
import { isGap } from '../../common/utils/wall';
import { Vector3 } from 'three';

interface GetWallGeometryOptions {
  wall: Wall;
  width: number;
  height: number;
  depth: number;
}

const createRectShape = (x: number, y: number, width: number, height: number): THREE.Shape => {
  const rect = new THREE.Shape();

  // bottom left corner
  rect.moveTo(x, y);

  // draw counter-clockwise
  rect.lineTo(x, y + height);
  rect.lineTo(x + width, y + height);
  rect.lineTo(x + width, y);
  rect.lineTo(x, y);

  return rect;
}
const getWallGeometry = (options: GetWallGeometryOptions): any => {
  const { wall, width, height, depth } = options;

  // Wall
  const wallShape = createRectShape(0, 0, width, height);

  // Add brick gaps (holes) to wall shape
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
        const gapShape = createRectShape(gapX, gapY, gapWidth, gapHeight);
        wallShape.holes.push(gapShape);
        // const gapGeometry = new THREE.ShapeGeometry(gapShape);
        // geometry.merge(gapGeometry);
      }
      x += brickWidth + MORTAR_THICKNESS;
    });
  });

  const extrudeSettings = {
    bevelEnabled: false,
    depth,
  }
  const geometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings );

  // const geometry = new THREE.ShapeGeometry(wallShape);
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
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = cameraPositionZ * 2;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.z = 2000;
  camera.position.z = cameraPositionZ;
  console.log('camera.position:', camera.position);

  // Scene
  const scene = new THREE.Scene();

  // Plane Geometry (Test Camera)
  // const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  // // const planeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // scene.add(plane);

  // Wall Geometry
  const geometry = getWallGeometry({
    wall,
    width,
    height,
    depth,
  });

  // Material
  // The `MeshBasicMaterial` is not affected by lights.
  // Use a `MeshPhongMaterial` which is.
  // const material = new THREE.MeshBasicMaterial({color: BRICK_COLOR});
  const material = new THREE.MeshPhongMaterial({color: BRICK_COLOR, side: THREE.DoubleSide });
  // const material = new THREE.MeshLambertMaterial({ color: 0xffffff })
  // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

  // Mesh
  const mesh = new THREE.Mesh(geometry, material);
  console.log('mesh.position:', mesh.position);

  const box = new THREE.Box3().setFromObject(mesh);
  const size = new Vector3();
  const centre = new Vector3();
  box.getSize(size);
  box.getCenter(centre);
  console.log('mesh size:', box.min, box.max, size, centre);

  // Add to scene
  scene.add(mesh);

  // Add light
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // Animate
  const render = (time: number) => {
    time *= 0.001;  // convert time from milliseconds to seconds

    // mesh.rotation.x = time; // radians
    // mesh.rotation.y = time; // radians
    const speed = .2;
    const rot = time * speed;
    // mesh.rotation.x = rot;
    mesh.rotation.y = rot;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  // Render
  // renderer.render(scene, camera);
  requestAnimationFrame(render);
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
