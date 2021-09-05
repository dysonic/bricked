import * as THREE from 'three';
import { Wall } from '../../common/types/wall';
import { getWallWidth, getWallHeight } from  '../../common/utils/wall';
import { getCourseHeight } from '../../common/utils/coursing-chart';
import { MORTAR_THICKNESS} from '../../common/constants';
import { isGap } from '../../common/utils/wall';

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

export const createWallGeometry = (wall: Wall): any => {

  // One unit in three.js is one metre. Convert mm to metres.
  const widthUnits = getWallWidth(wall) / 1000;
  const heightUnits = getWallHeight(wall) / 1000;
  const depthUnits = wall.brickPalette.S / 1000; // double thickness

  // Wall
  const wallShape = createRectShape(0, 0, widthUnits, heightUnits);

  // Add brick gaps (holes) to wall shape
  const gapHeight = (wall.brickDimension.height + MORTAR_THICKNESS);
  const gapUnitHeight = gapHeight / 1000;
  wall.courses.forEach((course: string, i: number) => {
    const cn: number = i + 1;
    const y: number = getCourseHeight(cn, wall.coursingChart);
    let x: number = 0;
    course.split('').forEach(brickLetter => {
      const brickWidth = wall.brickPalette[brickLetter.toUpperCase()];
      if (isGap(brickLetter)) {
        const gapUnitX = (x - MORTAR_THICKNESS) / 1000;
        const gapUnitY = (y - gapHeight) / 1000;
        const gapUnitWidth = (brickWidth + (2 * MORTAR_THICKNESS)) / 1000;
        console.log(`gap C${cn} - (x,y,w,h): ${gapUnitX}, ${gapUnitY}, ${gapUnitWidth}, ${gapUnitHeight}`);
        const gapShape = createRectShape(gapUnitX, gapUnitY, gapUnitWidth, gapUnitHeight);
        wallShape.holes.push(gapShape);
      }
      x += brickWidth + MORTAR_THICKNESS;
    });
  });

  const extrudeSettings = {
    bevelEnabled: false,
    depth: depthUnits,
  }
  const geometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings );
  geometry.center();
	return geometry;
};


export const calculateVertices = (wall: Wall) => {

};
