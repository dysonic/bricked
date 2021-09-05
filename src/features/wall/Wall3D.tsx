import React, { FC, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Wall3D.scss';
import { Wall } from '../../common/types/wall';
import { getWallWidth, getWallHeight } from  '../../common/utils/wall';
import { BRICK_COLOR } from '../../common/constants';
import { createWallGeometry } from '../export/utils';

const calculateCameraZPosition = (fovDegrees: number, halfWidthUnit: number, halfHeightUnit: number): number => {
  const a = (fovDegrees / 2) * Math.PI / 180;
  const s = 1.2 * halfHeightUnit;
  const z = s / Math.tan(a);
  return Math.ceil(z);
};

const renderWall = (canvas: HTMLCanvasElement | null, wall: Wall) => {
  if (!canvas) {
    console.log('no canvas!');
    return;
  }

  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;
  console.log(`canvas dimensions: ${canvasWidth}x${canvasHeight}`);

  const width = getWallWidth(wall);
  const height = getWallHeight(wall);
  const depth = wall.brickPalette.S; // double thickness
  console.log(`wall - (width, height, depth):, ${width}, ${height}, ${depth}`);
  const halfWidthUnit = width / 2000;
  const halfHeightUnit = height / 2000;
  const halfDepthUnit = depth / 2000;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( canvasWidth, canvasHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Camera
  const fov = 75; // field-of-view (degrees)
  const cameraPositionZ = calculateCameraZPosition(fov, halfWidthUnit, halfHeightUnit);
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = cameraPositionZ * 2;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.z = 2000;
  camera.position.z = cameraPositionZ;
  // camera.position.set(0, halfHeight, cameraPositionZ);
  console.log('camera.position:', camera.position);

  // Scene
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color('red');

  // Help!
  // const axesHelper = new THREE.AxesHelper( 5 );
  // scene.add( axesHelper );

  // Plane Geometry (Test Camera)
  // const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  // // const planeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // scene.add(plane);

  // Wall Geometry
  const geometry = createWallGeometry(wall);

  // Material
  // The `MeshBasicMaterial` is not affected by lights.
  // Use a `MeshPhongMaterial` which is.
  // const material = new THREE.MeshBasicMaterial({color: BRICK_COLOR});
  const material = new THREE.MeshPhongMaterial({color: BRICK_COLOR, side: THREE.DoubleSide });
  // const material = new THREE.MeshLambertMaterial({ color: 0xffffff })
  // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

  // Wall Mesh
  const wallMesh = new THREE.Mesh(geometry, material);
  console.log('mesh.position:', wallMesh.position);
  scene.add(wallMesh);
  // wallMesh.position.setX(-halfWidth);

  // const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
  const size = 10;
  const divisions = 10;
  const grid = new THREE.GridHelper(size, divisions);
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  grid.position.setY(-halfHeightUnit);
  scene.add( grid );

  // Ground
  const groundLength = width * 2;
  const ground = new THREE.Mesh( new THREE.PlaneGeometry( groundLength, groundLength ), new THREE.MeshBasicMaterial( { color: 0x999999, depthWrite: false } ) );
  ground.rotation.x = - Math.PI / 2;
  ground.position.setY(-halfHeightUnit);
  scene.add( ground );

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
    wallMesh.rotation.y = rot;
    grid.rotation.y = rot;

    // ground.rotation.x = rot;
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
